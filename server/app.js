const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const dataRoutes = require('./routers/dataType.route.js');
const dynamicFormRoutes = require('./routers/dynamicForm.route.js');
const chatRoutes = require('./routers/chat.route.js');
const uploadRoutes = require('./routers/upload.route.js');
const stripeRoutes = require('./routers/stripe.route.js');
const authRoutes = require('./routers/auth.route.js'); // Import authRoutes
const { stripeWebhook } = require('./controllers/stripe.controller.js');
const flutterwaveRouter = require('./routers/flutterwave.route.js');
const infiniteScrollRoutes = require('./routers/infiniteScroll.route.js');

// Initialize Express app
const app = express();

// Mount webhook route BEFORE express.json() and as a direct handler
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), stripeWebhook);


app.use(express.json());
app.use(cors());

app.use('/api', dataRoutes);
app.use('/api', dynamicFormRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/chat/upload', uploadRoutes);
app.use('/api/payments', stripeRoutes);
app.use('/api/auth', authRoutes); // Register authRoutes
app.use('/api/payments/flutterwave', flutterwaveRouter);
app.use('/api', infiniteScrollRoutes); // <-- Add this line to register infinite scroll routes


// Add a base route for "/"
app.get('/', (req, res) => {
  res.send('API is running. See /api for available endpoints.');
});

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
