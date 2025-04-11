const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  date: { type: String, required: true },
  largeGroupChurch: String,
  children: String,
  childrenWorkers: String,
  blueChips: String,
  donations: String,
  teens: String,
  mensLifeIssues: String,
  mensAddiction: String,
  womensAddiction: String,
  womensLifeIssues: String,
  newBeginnings: String,
  baptisms: String,
  mealsServed: String,
  salesFromBooks: String,
  foodDonation: String,
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);