// models/PendingReport.js

const mongoose = require('mongoose');

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
});

module.exports = mongoose.model('PendingReport', pendingReportSchema);