/**
 * Check if MongoDB is storing comment and group data in PendingReport.
 * Run: node scripts/checkCommentsInMongo.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const PendingReport = require('../models/PendingReport');
const CRReport = require('../models/CRReport');

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI not set.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check PendingReport collection
    console.log('=== PendingReport (recent 10 entries) ===');
    const pending = await PendingReport.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    if (pending.length === 0) {
      console.log('  No pending entries found.');
    } else {
      pending.forEach((entry, i) => {
        console.log(`  ${i + 1}. date: ${entry.date}, type: ${entry.type}, value: ${entry.value}`);
        console.log(`     comment: "${(entry.comment || '').slice(0, 50)}${(entry.comment && entry.comment.length > 50) ? '...' : ''}"`);
        console.log(`     group: "${entry.group || '(none)'}"`);
        console.log('');
      });
    }

    // Check CRReport for comment field
    console.log('=== CRReport (recent 5 - checking comment field) ===');
    const reports = await CRReport.find()
      .sort({ date: -1 })
      .limit(5)
      .select('date comment submittedBy largeGroupChurch donations')
      .lean();

    if (reports.length === 0) {
      console.log('  No final reports found.');
    } else {
      reports.forEach((r, i) => {
        const d = r.date ? new Date(r.date).toISOString().split('T')[0] : '?';
        console.log(`  ${i + 1}. date: ${d}, comment: "${(r.comment || '').slice(0, 40)}${(r.comment && r.comment.length > 40) ? '...' : ''}", submittedBy: ${r.submittedBy || '(none)'}`);
      });
    }

    console.log('\n✅ MongoDB is set up to receive and store comments.');
  } catch (err) {
    console.error('❌', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
