const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  authId: { type: String, required: true, unique: true }, // ID from external auth service
  email: { type: String, required: true, unique: true },
  name: { type: String },
  avatar: { type: String },
  provider: { type: String }, // e.g. 'google', 'github', 'facebook', 'local'
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StripePayment' }],
  flutterwavePayments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FlutterwavePayment' }],
  subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StripePayment' }],
  cardTokens: [{
    token: { type: String, required: true },
    last4: { type: String },
    expMonth: { type: String },
    expYear: { type: String },
    brand: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', UserSchema);
