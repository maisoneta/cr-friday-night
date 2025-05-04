// =======================================
// ✅ MongoDB Connection Configuration
// =======================================

// Import Mongoose ODM library to interface with MongoDB
const mongoose = require('mongoose');

// ---------------------------------------
// 🛠 Connect to MongoDB using .env config
// ---------------------------------------
const connectDB = async () => {
  try {
    // Attempt connection using the MONGO_URI from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Log a success message with the connected host info
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log error details
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    // Exit the Node.js process with a failure code
    process.exit(1);
  }
};

// Export the connectDB function so it can be used in other backend files (e.g., server.js)
module.exports = connectDB;