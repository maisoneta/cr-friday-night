// backend/server.js

// ✅ Core dependencies
const express = require('express');               // Web framework for Node.js
const dotenv = require('dotenv');                 // Loads environment variables from .env file
const cors = require('cors');                     // Middleware to enable CORS
const connectDB = require('./config/db');         // Custom MongoDB connection module

// ✅ Route handlers
const pendingRoutes = require('./routes/pending');    // Handles staging (pending) inputs
const reportsRoutes = require('./routes/reports');    // Handles finalized CR report submissions

// ✅ Load environment variables (e.g., MONGO_URI, PORT)
dotenv.config();

// ✅ Connect to MongoDB using provided MONGO_URI
connectDB();

// ✅ Initialize the Express app
const app = express();

// ✅ Global middleware
app.use(cors());              // Allow requests from any domain
app.use(express.json());      // Parse JSON bodies from frontend
app.options('*', cors());     // Handle CORS preflight requests

// ✅ Mount API routes
app.use('/api/pending', pendingRoutes);   // Partial inputs (staging)
app.use('/api/reports', reportsRoutes);   // Final reports + review logic

// ✅ Root route for health check or basic testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Define the port from environment or fallback to 5002
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`✅ Server running and accessible on port ${PORT}`);
});