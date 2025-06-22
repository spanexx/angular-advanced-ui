const express = require('express');
const router = express.Router();
const dynamicFormController  = require('../controllers/dynamicForm.controller');



router.get('/form-schema/:name', dynamicFormController.getFormSchemaByName);

module.exports = router;