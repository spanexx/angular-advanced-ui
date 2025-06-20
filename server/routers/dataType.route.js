const express = require('express');
const { getData } = require('../controllers/dataType.controller.js');

const router = express.Router();

// GET paginated, sorted, filtered data
router.get('/data', getData);

module.exports = router;