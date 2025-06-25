const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

router.get('/', chatController.getMessages);
router.post('/', chatController.createMessage);

module.exports = router;
