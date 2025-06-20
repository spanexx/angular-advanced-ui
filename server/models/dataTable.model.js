const mongoose = require('mongoose');

const DataItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true },
  category: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DataItem', DataItemSchema);