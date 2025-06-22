const FormSchema = require('../models/dynamicForm.model');

exports.getFormSchemaByName = async (req, res) => {
  try {
    const form = await FormSchema.findOne({ name: req.params.name });
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form.fields);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};