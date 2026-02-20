/**
 * Verification script: CRReport schema stores comment and submittedBy correctly.
 * Run: node scripts/verifyCommentSubmittedBy.js
 * Uses .env MONGO_URI. Creates a test report, verifies fields, then deletes it.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const CRReport = require('../models/CRReport');

const TEST_DATE = new Date('2099-01-15'); // Future date to avoid clashes
const TEST_COMMENT = 'Verification test comment - safe to delete';
const TEST_SUBMITTED_BY = 'verification-script';

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI not set. Add it to backend/.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create test report with comment and submittedBy
    const report = new CRReport({
      date: TEST_DATE,
      largeGroupChurch: 99,
      comment: TEST_COMMENT,
      submittedBy: TEST_SUBMITTED_BY,
    });
    await report.save();
    console.log('✅ Test report created');

    // Fetch it back and verify
    const fetched = await CRReport.findOne({ date: TEST_DATE });
    if (!fetched) {
      throw new Error('Report not found after save');
    }

    const hasComment = fetched.comment === TEST_COMMENT;
    const hasSubmittedBy = fetched.submittedBy === TEST_SUBMITTED_BY;

    if (hasComment && hasSubmittedBy) {
      console.log('✅ comment field: stored and retrieved correctly');
      console.log('✅ submittedBy field: stored and retrieved correctly');
    } else {
      throw new Error(
        `Verification failed: comment=${hasComment}, submittedBy=${hasSubmittedBy}`
      );
    }

    // Clean up
    await CRReport.deleteOne({ date: TEST_DATE });
    console.log('✅ Test report deleted');
    console.log('\n✅ All checks passed. Schema is correct.');
  } catch (err) {
    console.error('❌', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
