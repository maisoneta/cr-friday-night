// ✅ backfillTotalFunds.js
// This script updates all CRReport documents where totalFunds is 0
// by recalculating it as donations + salesFromBooks + foodDonation
require('dotenv').config(); // ✅ Load your .env file
const mongoose = require('mongoose');
const CRReport = require('../models/CRReport');
const connectDB = require('../config/db');

async function backfillTotalFunds() {
  try {
    await connectDB(); // ✅ Connect to MongoDB

    const reports = await CRReport.find({
        $or: [
          { totalFunds: { $exists: false } },
          { totalFunds: { $eq: 0 } }
        ]
      });
    console.log(`🔍 Found ${reports.length} reports to update...`);

    for (let report of reports) {
      const updatedTotal =
        Number(report.donations || 0) +
        Number(report.salesFromBooks || 0) +
        Number(report.foodDonation || 0);

      report.totalFunds = updatedTotal;
      await report.save();

      console.log(`✅ Updated ${report.date}: totalFunds = $${updatedTotal}`);
    }

    console.log('🎉 All reports updated successfully.');
    process.exit();
  } catch (err) {
    console.error('❌ Error during backfill:', err.message);
    process.exit(1);
  }
}

backfillTotalFunds();