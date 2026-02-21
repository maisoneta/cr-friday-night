// File: backend/server.js

/*
  Entry point for the Express server.
  Loads environment variables, connects to MongoDB,
  configures middleware, and sets up API routes.
*/

const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const pendingRoutes = require('./routes/pending');
const reportsRoutes = require('./routes/reports');

// Load environment variables from backend/.env (e.g., MONGO_URI, PORT)
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Show MongoDB connection status (credentials hidden in production)
if (process.env.NODE_ENV !== 'production') {
  console.log(`Connecting to MongoDB: ${process.env.MONGO_URI ? '✓ URI set' : '✗ URI missing'}`);
}

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Security headers
app.use(helmet());

// CORS: allowed origins from env (comma-separated) or defaults for local dev
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
  : [
      'https://cr-friday-night-frontend.onrender.com',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
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

// Rate limit write-heavy API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Mount routes
app.use('/api/pending', apiLimiter, pendingRoutes);
app.use('/api/reports', apiLimiter, reportsRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Health check for load balancers and monitoring
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const healthy = dbState === 1; // 1 = connected
  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    db: dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected',
  });
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});