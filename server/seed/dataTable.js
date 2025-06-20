const mongoose = require('mongoose');
const DataItem = require('../models/dataTable.model.js');
require('dotenv').config();



async function seedData() {
  // Connection URI (fallback to localhost)
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/yourdb'; // Replace 'yourdb' with your database name
  await mongoose.connect(uri);

  // Generate sample data
  const items = Array.from({ length: 50 }, (_, i) => ({
    name: `Item ${i + 1}`,
    value: Math.floor(Math.random() * 1000),
    category: ['Alpha', 'Beta', 'Gamma'][i % 3]
  }));

  // Clear existing collection and insert seeds
  await DataItem.deleteMany({});
  await DataItem.insertMany(items);
  console.log('Seeded', items.length, 'items');

  await mongoose.disconnect();
}

seedData().catch(err => console.error('Seeding error:', err));