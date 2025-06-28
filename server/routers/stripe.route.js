const express = require('express');
const { createCheckoutSession, stripeWebhook, getProducts, createSubscriptionSession } = require('../controllers/stripe.controller.js');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/create-checkout-session', authMiddleware, createCheckoutSession);
router.post('/create-subscription-session', authMiddleware, createSubscriptionSession); 
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
router.get('/products', getProducts);

module.exports = router;

