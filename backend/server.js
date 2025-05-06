// backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const pendingRoutes = require('./routes/pending');
const reportsRoutes = require('./routes/reports');

// ✅ Load environment variables (MONGO_URI, PORT)
dotenv.config();

// ✅ (Optional for debug) Show MongoDB URI (remove in production!)
console.log(`📡 Attempting to connect to MongoDB: ${process.env.MONGO_URI}`);

// ✅ Connect to MongoDB
connectDB();

// ✅ Initialize the Express app
const app = express();

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
app.use(express.json());

app.use('/api/pending', pendingRoutes);
app.use('/api/reports', reportsRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`✅ Server running and accessible on port ${PORT}`);
});