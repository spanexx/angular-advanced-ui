import mongoose from 'mongoose';

const DataItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true },
  category: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('DataItem', DataItemSchema);