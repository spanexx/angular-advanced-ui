const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { createPaymentLink, flutterwaveWebhook, chargeSavedCard, tokenizeCard, validateCharge } = require('../controllers/flutterwave.controller');
const router = express.Router();

// Create a payment link using Flutterwave
router.post('/create-payment-link', authMiddleware, createPaymentLink);
router.post('/charge-saved-card', authMiddleware, chargeSavedCard);

// Tokenize a card for recurring billing
router.post('/tokenize-card', authMiddleware, tokenizeCard);
// Validate OTP for card tokenization
router.post('/validate-charge', authMiddleware, validateCharge);

// Flutterwave webhook endpoint (no auth middleware!)
router.post('/webhook', express.json({ type: 'application/json' }), flutterwaveWebhook);

// Charge a saved card token (recurring billing)

module.exports = router;