const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  value: mongoose.Schema.Types.Mixed,
  label: String,
});

const conditionSchema = new mongoose.Schema({
  field: String,
  value: mongoose.Schema.Types.Mixed,
});

const dynamicFieldSchema = new mongoose.Schema({
  key: { type: String, required: true },
  label: String,
  type: String,
  defaultValue: mongoose.Schema.Types.Mixed,
  validators: [String],
  asyncValidator: String, // optional, store name or reference
  errorMessages: mongoose.Schema.Types.Mixed, // flexible object
  options: [optionSchema],
  condition: conditionSchema,
});

const formSchema = new mongoose.Schema({
  name: { type: String, required: true },  // e.g., "registrationForm"
  description: String,
  fields: [dynamicFieldSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

module.exports = mongoose.model('FormSchema', formSchema);
