const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const StripePayment = require('../models/stripePayment.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');

const createCheckoutSession = async (req, res) => {
  try {
    const { line_items, success_url, cancel_url, userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Add other methods as needed
      mode: 'payment',
      line_items,
      success_url,
      cancel_url
    });

    // Record payment as 'pending' in DB
    if (line_items && line_items.length > 0) {
      // Try to find the product by name (assuming one product per checkout)
      const productName = line_items[0]?.price_data?.product_data?.name;
      const product = await Product.findOne({ name: productName });
      const payment = await StripePayment.create({
        user: userId, // <-- Add user field
        product: product ? product._id : undefined,
        stripeSessionId: session.id,
        amount: line_items[0]?.price_data?.unit_amount || 0,
        currency: line_items[0]?.price_data?.currency || 'usd',
        status: 'pending', 
        // customerEmail: can be set after payment if needed
      });
      // Link payment to user
      if (userId) {
        await User.findByIdAndUpdate(userId, { $push: { payments: payment._id } });
      }
    }

    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Something went wrong creating session.' });
  }
};

const createSubscriptionSession = async (req, res) => {
  try {
    const { line_items, success_url, cancel_url, userId } = req.body;

    console.log('Creating subscription session with:', {
      line_items,
      success_url,
      cancel_url,
      userId
    });

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // For subscriptions, line_items should use Stripe price IDs
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items, // [{ price: 'price_xxx', quantity: 1 }]
      success_url,
      cancel_url
    });

    // Optionally record subscription intent in DB
    if (line_items && line_items.length > 0) {
      const payment = await StripePayment.create({
        user: userId, // <-- Add user field
        // No product reference for subscription, or you can add a plan/subscription field
        stripeSessionId: session.id,
        amount: 0, // Amount will be set by Stripe
        currency: 'usd',
        status: 'pending',
        type: 'subscription' // Mark as subscription
      });
      // Link subscription to user
      if (userId) {
        await User.findByIdAndUpdate(userId, { $push: { subscriptions: payment._id } });
      }
    }

    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe subscription error:', error);
    res.status(500).json({ error: 'Something went wrong creating subscription session.' });
  }
};

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    try {
      // Debug log
      console.log('Webhook session.id:', session.id);
      // Find the payment and update
      const updated = await StripePayment.findOneAndUpdate(
        { stripeSessionId: session.id },
        {
          status: 'paid',
          customerEmail: session.customer_details?.email || session.customer_email || undefined,
          amount: session.amount_total,
          currency: session.currency
        },
        { new: true }
      );
      console.log('StripePayment updated:', updated);
      // If payment found and updated, also update user profile
      if (updated && updated.customerEmail) {
        const user = await User.findOne({ email: updated.customerEmail });
        if (user) {
          // Link payment to user if not already linked
          if (!updated.user || String(updated.user) !== String(user._id)) {
            updated.user = user._id;
            await updated.save();
          }
          if (updated.type === 'subscription') {
            if (!user.subscriptions.includes(updated._id)) {
              user.subscriptions.push(updated._id);
              await user.save();
            }
          } else {
            if (!user.payments.includes(updated._id)) {
              user.payments.push(updated._id);
              await user.save();
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to update payment record or user profile:', err);
    }
  } else if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
    const session = event.data.object;
    try {
      await StripePayment.findOneAndUpdate(
        { stripeSessionId: session.id },
        { status: 'failed' }
      );
    } catch (err) {
      console.error('Failed to update payment record:', err);
    }
  }

  res.json({ received: true });
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

module.exports = { createCheckoutSession, createSubscriptionSession, stripeWebhook, getProducts };