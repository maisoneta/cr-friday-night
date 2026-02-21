// File: backend/scripts/cleanPendingDuplicates.js

/*
  Utility script to clean up duplicate PendingReport entries in MongoDB.
  Keeps only the first occurrence for each unique date.
  Intended for one-time use or admin-level maintenance tasks.
*/

const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const PendingReport = require('../models/PendingReport');

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error('❌ MONGO_URI is required. Set it in .env or your environment.');
  process.exit(1);
}

// Connect to MongoDB and initiate cleanup
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
    const all = await PendingReport.find({}).sort({ date: 1, _id: 1 }); // Sort by date and ID
    const seenDates = new Set(); // Track which dates we've seen
    let removedCount = 0;

    for (let i = 0; i < all.length; i++) {
      const report = all[i];
      if (seenDates.has(report.date)) {
        await PendingReport.deleteOne({ _id: report._id }); // Delete duplicates
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