// models/PendingReport.js

const mongoose = require('mongoose');

// Define schema for pending reports
const pendingReportSchema = new mongoose.Schema({
  date: {
    type: String, // YYYY-MM-DD format for easy matching
    required: true,
  },
  type: {
    type: String, // e.g., 'largeGroupChurch', 'donations'
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    default: '',
  },
  group: {
    type: String,
    default: '',
  },
});

// Create a unique index on the (date, type) pair for database-level protection
pendingReportSchema.index({ date: 1, type: 1 }, { unique: true });

/*
  This schema ensures:
  - Only one pending report can exist for any given (date, type) pair.
  - Allows multiple sections ("types") for the same date.
  - Submissions with a duplicate (date, type) will fail with a MongoDB error (which our route handles gracefully).
*/

module.exports = mongoose.model('PendingReport', pendingReportSchema);