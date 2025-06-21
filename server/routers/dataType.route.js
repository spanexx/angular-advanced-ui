const express = require('express');
const multer = require('multer');
const { getData, importData } = require('../controllers/dataType.controller.js');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// GET paginated, sorted, filtered data
router.get('/data', getData);

// POST import data from file (CSV/Excel)
router.post('/data/import', upload.single('file'), importData);

module.exports = router;