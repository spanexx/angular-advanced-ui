const DataItem = require('../models/dataTable.model');

exports.getInfiniteScrollData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const size = parseInt(req.query.size) || 10;

    const totalItems = await DataItem.countDocuments();
    const totalPages = Math.ceil(totalItems / size);

    const dataItems = await DataItem.find()
      .skip(page * size)
      .limit(size);

    res.status(200).json({
      items: dataItems,
      currentPage: page,
      totalPages: totalPages
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
