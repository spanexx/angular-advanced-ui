const express = require('express');
const { getInfiniteScrollData } = require('../controllers/infiniteScroll.controller');

const router = express.Router();

router.get('/infinite-scroll-data', getInfiniteScrollData);

module.exports = router;
