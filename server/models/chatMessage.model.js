const mongoose = require('mongoose');

const ChatAttachmentSchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'file'], required: true },
  url: { type: String, required: true },
  name: { type: String, required: true }
}, { _id: false });

const ChatMessageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  sender: { type: String, required: true },
  avatarUrl: String,
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
  attachments: [ChatAttachmentSchema]
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
