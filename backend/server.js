// File: backend/server.js

/*
  Entry point for the Express server.
  Loads environment variables, connects to MongoDB,
  configures middleware, and sets up API routes.
*/

const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const pendingRoutes = require('./routes/pending');
const reportsRoutes = require('./routes/reports');

// Load environment variables from backend/.env (e.g., MONGO_URI, PORT)
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Show MongoDB URI (for debugging only – remove in production)
console.log(`Connecting to MongoDB: ${process.env.MONGO_URI}`);

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Allow requests only from specific origins
const allowedOrigins = [
  'https://cr-friday-night-frontend.onrender.com',
  'http://localhost:3000',
  'http://192.168.50.98:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Mount routes
app.use('/api/pending', pendingRoutes);
app.use('/api/reports', reportsRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});