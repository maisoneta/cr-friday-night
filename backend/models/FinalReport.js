const mongoose = require('mongoose');

const finalReportSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true, // prevent duplicates for same night
  },
  largeGroupChurch: Number,
  children: Number,
  childrenWorkers: Number,
  blueChips: Number,
  donations: Number,
  salesFromBooks: Number,
  foodDonation: Number,
  mealsServed: Number,
  teens: Number,
  mensLifeIssues: Number,
  mensAddiction: Number,
  womensAddiction: Number,
  womensLifeIssues: Number,
  newBeginnings: Number,
  baptisms: Number,
  stepStudyGraduates: Number,
  comment: String, // ✅ New field: Reviewer notes
  submittedBy: String, // 🔒 Optional future use (e.g., logged-in user)
});

module.exports = mongoose.model('FinalReport', finalReportSchema);