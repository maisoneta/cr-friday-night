const mongoose = require('mongoose');

// Show the URI to verify it's being loaded correctly
console.log(`📡 Attempting to connect to MongoDB: ${process.env.MONGO_URI}`);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit the process if connection fails
  }
};

module.exports = connectDB;
