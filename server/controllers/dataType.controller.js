const DataItem = require('../models/dataTable.model');

/**
 * GET /api/data
 * Query Params: page, size, sort, filter[key]
 */
exports.getData = async (req, res, next) => {
// fetch query parameters
  const { page = 1, size = 10, sort = 'createdAt', filter = {} } = req.query;

  try {
    // Build filter object
    const filterObj = {};
    for (const key in filter) {
      if (filter[key]) {
        filterObj[key] = new RegExp(filter[key], 'i'); // case-insensitive regex
      }
    }

    // Fetch paginated, sorted, and filtered data
    const items = await DataItem.find(filterObj)
      .sort(sort)
      .skip((page - 1) * size)
      .limit(Number(size));

    // Count total items for pagination
    const totalItems = await DataItem.countDocuments(filterObj);

    res.status(200).json({
      items,
      totalItems,
      totalPages: Math.ceil(totalItems / size),
      currentPage: Number(page)
    });
  } catch (error) {
    next(error);
  }
};