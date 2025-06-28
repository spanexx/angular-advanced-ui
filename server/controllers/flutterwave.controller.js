const axios = require('axios');
const FlutterwavePayment = require('../models/flutterwavePayment.model');
const User = require('../models/user.model');
const CryptoJS = require('crypto-js');

// Validate required fields helper
function validateFlutterwaveFields(body) {
  const required = ['amount', 'email', 'name', 'currency', 'tx_ref', 'redirect_url'];
  for (const field of required) {
    if (!body[field]) return field;
  }
  return null;
}

const createPaymentLink = async (req, res) => {
  // Validate input
  const missing = validateFlutterwaveFields(req.body);
  if (missing) {
    return res.status(400).json({ error: `${missing} is required` });
  }

  // Check for secret key
  if (!process.env.FLW_SECRET_KEY) {
    console.error('FLW_SECRET_KEY is not set in environment variables');
    return res.status(500).json({ error: 'Payment configuration error' });
  }

  const { amount, email, name, currency, tx_ref, redirect_url } = req.body;

  // Set default redirect and cancel URLs if not provided
  const baseUrl = req.headers.origin || req.protocol + '://' + req.get('host');
  const successUrl = redirect_url || `${baseUrl}/flutterwave-success`;
  const cancelUrl = `${baseUrl}/flutterwave-cancel`;

  try {
    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      {
        tx_ref,
        amount,
        currency,
        redirect_url: successUrl,
        customer: { email, name },
        customizations: {
          title: 'Your App Name',
          description: 'Payment for goods/services',
        },
        meta: {
          cancel_url: cancelUrl
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    // Log full error for debugging
    console.error('Flutterwave Error:', err.response?.data || err.message, err.stack);
    res.status(500).json({ error: 'Failed to create payment link' });
  }
};

// Flutterwave Webhook Handler
const flutterwaveWebhook = async (req, res) => {
  const secretHash = process.env.FLUTTER_ENCRYPTION;
  const signature = req.headers['verif-hash'];
  if (!secretHash || signature !== secretHash) {
    console.warn('Invalid Flutterwave webhook signature');
    return res.status(401).send('Invalid signature');
  }
  const event = req.body;
  console.log('Flutterwave webhook event:', JSON.stringify(event, null, 2)); // Log full payload for debugging

  if (event.event === 'charge.completed' && event.data.status === 'successful') {
    try {
      // Find or create payment record
      let payment = await FlutterwavePayment.findOne({ tx_ref: event.data.tx_ref });
      if (!payment) {
        payment = await FlutterwavePayment.create({
          tx_ref: event.data.tx_ref,
          amount: event.data.amount,
          currency: event.data.currency,
          status: event.data.status,
          customerEmail: event.data.customer.email,
          flw_id: event.data.id,
        });
      } else {
        payment.status = event.data.status;
        payment.amount = event.data.amount;
        payment.currency = event.data.currency;
        payment.customerEmail = event.data.customer.email;
        payment.flw_id = event.data.id;
        await payment.save();
      }
      // Link to user if possible
      if (payment.customerEmail) {
        const userModel = require('../models/user.model');
        const user = await userModel.findOne({ email: payment.customerEmail });
        if (user) {
          // Save card token if present (tokenization)
          if (event.data.card && event.data.card.token) {
            const tokenExists = user.cardTokens.some(t => t.token === event.data.card.token);
            if (!tokenExists) {
              user.cardTokens.push({
                token: event.data.card.token,
                last4: event.data.card.last4,
                expMonth: event.data.card.expiry.split('/')[0],
                expYear: event.data.card.expiry.split('/')[1],
                brand: event.data.card.type
              });
              await user.save();
            }
          }
          if (!user.flutterwavePayments.includes(payment._id)) {
            user.flutterwavePayments.push(payment._id);
            await user.save();
          }
          if (!payment.user || String(payment.user) !== String(user._id)) {
            payment.user = user._id;
            await payment.save();
          }
        }
      }
    } catch (err) {
      console.error('Failed to update Flutterwave payment or user:', err);
    }
  } else if (event.event === 'charge.completed' && event.data.status !== 'successful') {
    // Mark as failed
    try {
      await FlutterwavePayment.findOneAndUpdate(
        { tx_ref: event.data.tx_ref },
        { status: event.data.status }
      );
    } catch (err) {
      console.error('Failed to update failed Flutterwave payment:', err);
    }
  }
  res.status(200).send('OK');
};

// Charge a saved card token for recurring billing
const chargeSavedCard = async (req, res) => {
  const { userId, amount, currency, tx_ref, narration } = req.body;
  if (!userId || !amount || !currency || !tx_ref) {
    return res.status(400).json({ error: 'userId, amount, currency, and tx_ref are required' });
  }
  try {
    const user = await User.findById(userId);
    if (!user || !user.cardTokens || user.cardTokens.length === 0) {
      console.warn('No saved card tokens found for user:', userId);
      return res.status(404).json({ error: 'No saved card token for user' });
    }
    // Use the most recent token
    const cardToken = user.cardTokens[user.cardTokens.length - 1].token;
    const response = await axios.post(
      'https://api.flutterwave.com/v3/tokenized-charges',
      {
        token: cardToken,
        amount,
        currency,
        tx_ref,
        email: user.email,
        narration: narration || 'Recurring charge',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    // Record the payment as pending
    const payment = await FlutterwavePayment.create({
      user: user._id,
      tx_ref,
      amount,
      currency,
      status: 'pending',
      customerEmail: user.email,
      flw_id: response.data.data.id,
    });
    user.flutterwavePayments.push(payment._id);
    await user.save();
    res.json(response.data);
  } catch (err) {
    console.error('Recurring charge error:', err.response?.data || err.message, err.stack);
    res.status(500).json({ error: 'Failed to charge saved card' });
  }
};

// Tokenize a card after a successful payment (requires card details or payment reference)
const tokenizeCard = async (req, res) => {
  const { userId, card_number, cvv, expiry_month, expiry_year, email, pin } = req.body;
  if (!userId || !card_number || !cvv || !expiry_month || !expiry_year || !email || !pin) {
    return res.status(400).json({ error: 'Missing required card or user details' });
  }
  try {
    const encryptionKey = process.env.FLW_ENCRYPTION_KEY;
    if (!encryptionKey) {
      return res.status(500).json({ error: 'Encryption key not set in environment' });
    }
    const payload = {
      card_number,
      cvv,
      expiry_month,
      expiry_year,
      currency: 'NGN',
      amount: 50, // Minimal amount for tokenization
      email,
      tx_ref: 'tokenize-' + Date.now(),
      authorization: { mode: 'pin', pin },
    };
    const encrypted = encrypt3DES(payload, encryptionKey);
    const response = await axios.post(
      'https://api.flutterwave.com/v3/charges?type=card',
      { client: encrypted },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Flutterwave tokenization response:', JSON.stringify(response.data, null, 2));
    const token = response.data.data?.card?.token;
    const metaAuth = response.data.meta?.authorization || response.data.data?.meta?.authorization;
    const mode = metaAuth?.mode;
    const flwRef = response.data.data?.flw_ref;
    const redirectUrl = metaAuth?.redirect || response.data.data?.redirect_url;
    if (!token && (redirectUrl || mode === 'otp')) {
      // Further authentication required (e.g., OTP/3DS). Return redirect URL or OTP mode to frontend.
      return res.json({ requiresAuth: true, redirectUrl, flwRef, mode, tx_ref: payload.tx_ref });
    }
    if (!token) {
      return res.status(400).json({ error: 'Tokenization failed, no token returned' });
    }
    // Save token to user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const tokenExists = user.cardTokens.some(t => t.token === token);
    if (!tokenExists) {
      user.cardTokens.push({
        token,
        last4: response.data.data.card.last_4digits,
        expMonth: response.data.data.card.expiry.split('/')[0],
        expYear: response.data.data.card.expiry.split('/')[1],
        brand: response.data.data.card.type
      });
      await user.save();
    }
    res.json({ success: true, token });
  } catch (err) {
    console.error('Tokenization error:', err.response?.data || err.message, err.stack);
    res.status(500).json({ error: 'Failed to tokenize card' });
  }
};

// Validate OTP and complete card tokenization
const validateCharge = async (req, res) => {
  const { flw_ref, otp, userId } = req.body;
  if (!flw_ref || !otp || !userId) {
    return res.status(400).json({ error: 'flw_ref, otp, and userId are required' });
  }
  try {
    const response = await axios.post(
      'https://api.flutterwave.com/v3/validate-charge',
      { otp, flw_ref },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Flutterwave validate-charge response:', JSON.stringify(response.data, null, 2));
    const token = response.data.data?.card?.token;
    if (!token) {
      return res.status(400).json({ error: 'Tokenization failed after OTP, no token returned' });
    }
    // Save token to user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const tokenExists = user.cardTokens.some(t => t.token === token);
    if (!tokenExists) {
      user.cardTokens.push({
        token,
        last4: response.data.data.card.last_4digits,
        expMonth: response.data.data.card.expiry.split('/')[0],
        expYear: response.data.data.card.expiry.split('/')[1],
        brand: response.data.data.card.type
      });
      await user.save();
    }
    res.json({ success: true, token });
  } catch (err) {
    console.error('Validate charge error:', err.response?.data || err.message, err.stack);
    res.status(500).json({ error: 'Failed to validate charge' });
  }
};

function encrypt3DES(payload, encryptionKey) {
  // Pad key to 24 bytes
  let key = encryptionKey;
  if (key.length < 24) key = key.padEnd(24, '0');
  if (key.length > 24) key = key.slice(0, 24);
  const message = JSON.stringify(payload);
  const encrypted = CryptoJS.TripleDES.encrypt(message, CryptoJS.enc.Utf8.parse(key), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

module.exports = { createPaymentLink, flutterwaveWebhook, chargeSavedCard, tokenizeCard, encrypt3DES, validateCharge };