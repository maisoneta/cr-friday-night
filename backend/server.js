// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize express
const app = express();

// ✅ Middleware
app.use(cors());              // Enable CORS for all origins
app.use(express.json());      // Parse incoming JSON
app.options('*', cors());     // Handle preflight OPTIONS for CORS

// ✅ Mount routes from /reports.js
const reportRoutes = require('./routes/reports');
app.use('/api/reports', reportRoutes);

// ✅ Simple test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});