const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit_amount: { type: Number, required: true }, // price in cents
  description: { type: String },
  stripePriceId: { type: String }, // Not required for one-time payments
  isSubscription: { type: Boolean, default: false }, // true for subscriptions, false for one-time payments
  
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
