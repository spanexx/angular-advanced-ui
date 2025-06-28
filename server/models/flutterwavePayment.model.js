const mongoose = require('mongoose');

const FlutterwavePaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  tx_ref: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true }, // e.g. 'pending', 'successful', 'failed'
  customerEmail: { type: String },
  flw_id: { type: String }, // Flutterwave transaction ID
  type: { type: String, enum: ['payment'], default: 'payment' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

FlutterwavePaymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FlutterwavePayment', FlutterwavePaymentSchema);
