const DataItem = require('../models/dataTable.model');
const XLSX = require('xlsx');

// Helper: get field types from schema
const fieldTypes = {
  name: 'string',
  value: 'number',
  category: 'string',
  createdAt: 'date'
};

/**
 * GET /api/data
 * Query Params: page, size, sort, filter[key] or filter: { key: value }
 */
exports.getData = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const sort = req.query.sort || 'createdAt';

  console.log('Query parameters:', req.query);

  try {
    const filterObj = {};

    // Support nested filter object (from Angular HttpClient)
    if (req.query.filter && typeof req.query.filter === 'object') {
      Object.entries(req.query.filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (fieldTypes[key] === 'number') {
            const num = Number(value);
            if (!isNaN(num)) filterObj[key] = num;
          } else if (fieldTypes[key] === 'string') {
            filterObj[key] = new RegExp(value, 'i');
          } else {
            filterObj[key] = value;
          }
        }
      });
    }

    // Also support flat filter[xxx] keys
    Object.keys(req.query).forEach(key => {
      const match = key.match(/^filter\[(.*)\]$/);
      if (match && req.query[key] !== undefined && req.query[key] !== null && req.query[key] !== '') {
        const field = match[1];
        if (fieldTypes[field] === 'number') {
          const num = Number(req.query[key]);
          if (!isNaN(num)) {
            filterObj[field] = num;
          }
        } else if (fieldTypes[field] === 'string') {
          filterObj[field] = new RegExp(req.query[key], 'i');
        } else {
          filterObj[field] = req.query[key];
        }
      }
    });

    console.log('Filter object:', filterObj);

    const items = await DataItem.find(filterObj)
      .sort(sort)
      .skip((page - 1) * size)
      .limit(Number(size));

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

/**
 * POST /api/data/import
 * Accepts a CSV or Excel file and saves data to the database
 */
exports.importData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Parse file buffer using XLSX
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    let json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    if (!Array.isArray(json) || json.length === 0) {
      return res.status(400).json({ error: 'No data found in file' });
    }
    // Remove _id fields to avoid duplicate key errors
    json = json.map(row => {
      const { _id, ...rest } = row;
      return rest;
    });
    await DataItem.insertMany(json);
    res.json({ success: true, count: json.length });
  } catch (err) {
    console.error('Import error:', err);
    res.status(500).json({ error: 'Failed to import data' });
  }
};