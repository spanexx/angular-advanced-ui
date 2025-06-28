const mongoose = require('mongoose');

const StripePaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false }, // Not required for subscriptions
  stripeSessionId: { type: String, required: true },
  amount: { type: Number, required: true }, // in cents
  currency: { type: String, required: true },
  status: { type: String, required: true }, // e.g. 'pending', 'paid', 'failed'
  customerEmail: { type: String },
  stripePriceId: { type: String }, // Not required for one-time payments
  isSubscription: { type: Boolean, default: false }, // true for subscriptions, false for one-time payments
  type: { type: String, enum: ['payment', 'subscription'], default: 'payment' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

StripePaymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('StripePayment', StripePaymentSchema);
