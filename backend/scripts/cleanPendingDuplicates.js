// scripts/cleanPendingDuplicates.js

const mongoose = require('mongoose');
require('dotenv').config(); // <-- Add this to ensure .env is loaded

const PendingReport = require('../models/PendingReport');

// Get your connection string from the .env or hardcode it here for one-time use
const mongoURI = process.env.MONGO_URI || 'your_fallback_mongodb_connection_string';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  removeDuplicatePendingReports();
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

async function removeDuplicatePendingReports() {
  try {
    const all = await PendingReport.find({}).sort({ date: 1, _id: 1 });
    const seenDates = new Set();
    let removedCount = 0;

    for (let i = 0; i < all.length; i++) {
      const report = all[i];
      if (seenDates.has(report.date)) {
        await PendingReport.deleteOne({ _id: report._id });
        removedCount++;
        console.log(`Removed duplicate for date: ${report.date} (_id: ${report._id})`);
      } else {
        seenDates.add(report.date);
      }
    }

    console.log(`Cleanup complete. ${removedCount} duplicates removed.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}