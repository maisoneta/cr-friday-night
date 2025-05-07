// File: backend/models/FinalReport.js
const mongoose = require('mongoose');

const finalReportSchema = new mongoose.Schema({
  // Date of the report
  date: {
    type: String,
    required: true,
    unique: true,
  },

  // Attendance
  largeGroupChurch: Number,
  children: Number,
  childrenWorkers: Number,
  blueChips: Number,

  // Finances
  donations: Number,
  salesFromBooks: Number,
  foodDonation: Number,
  mealsServed: Number,

  // Group Participation
  teens: Number,
  mensLifeIssues: Number,
  mensAddiction: Number,
  womensAddiction: Number,
  womensLifeIssues: Number,
  newBeginnings: Number,

  // Milestones
  baptisms: Number,
  stepStudyGraduates: Number,

  // Report metadata
  comment: String,
  submittedBy: String,
});

module.exports = mongoose.model('FinalReport', finalReportSchema);