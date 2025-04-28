// ✅ Import Mongoose, the MongoDB ODM (Object Data Modeling) library
const mongoose = require('mongoose');

// ✅ Log the MongoDB URI from the environment variables to confirm it's being loaded properly
// This helps during development/debugging to ensure the URI is not undefined or malformed
//console.log(`📡 Attempting to connect to MongoDB: ${process.env.MONGO_URI}`);

// ✅ Define an async function to handle connecting to MongoDB
const connectDB = async () => {
  try {
    // 🟢 Connect to MongoDB using the URI from .env (no longer need deprecated options)
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // ✅ If successful, log the connected host name (e.g., cluster node or server name)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // ❌ If connection fails, log the error message
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    // 🔴 Exit the process with failure (non-zero) to stop the server from continuing without DB access
    process.exit(1);
  }
};

// ✅ Export the connectDB function so it can be required and run in other files (like server.js)
module.exports = connectDB;