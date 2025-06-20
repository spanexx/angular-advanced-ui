const DataItem = require('../models/dataTable.model');

/**
 * GET /api/data
 * Query Params: page, size, sort, filter[key]
 */
exports.getData = async (req, res, next) => {
  try {
    const page = parseInt(req.query['page']) || 0;
    const size = parseInt(req.query['size']) || 10;
    const sortParam = req.query['sort'] ? req.query['sort'].split(',') : ['createdAt', 'desc'];
    const sortObj = { [sortParam[0]]: sortParam[1] === 'asc' ? 1 : -1 };

    // Build filter object
    const filter = {};
    Object.keys(req.query).forEach(key => {
      const match = key.match(/^filter\[(.*)\]$/);
      if (match) {
        filter[match[1]] = new RegExp(req.query[key], 'i');
      }
    });

    const total = await DataItem.countDocuments(filter);
    const data = await DataItem.find(filter)
      .sort(sortObj)
      .skip(page * size)
      .limit(size)
      .lean();

    res.json({ data, total });
  } catch (err) {
    next(err);
  }
};