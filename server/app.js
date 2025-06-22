const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const dataRoutes = require('./routers/dataType.route.js');
const dynamicFormRoutes = require('./routers/dynamicForm.route.js');


// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', dataRoutes);
app.use('/api', dynamicFormRoutes);

const PORT = process.env['PORT'] || 3000;

// Connect to MongoDB and start server
mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

// API Routes
