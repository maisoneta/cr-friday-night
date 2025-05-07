// File: backend/models/Report_old.js
const mongoose = require('mongoose');

// Schema for storing older Celebrate Recovery report submissions
const reportSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Date of the report (YYYY-MM-DD)
  largeGroupChurch: String,              // Number of attendees in large group
  children: String,                      // Number of children present
  childrenWorkers: String,               // Number of volunteers with children
  blueChips: String,                     // Number of blue chips taken
  donations: String,                     // Amount donated
  teens: String,                         // Teen group attendance
  mensLifeIssues: String,                // Men's Life Issues group attendance
  mensAddiction: String,                 // Men's Addiction group attendance
  womensAddiction: String,               // Women's Addiction group attendance
  womensLifeIssues: String,              // Women's Life Issues group attendance
  newBeginnings: String,                 // New Beginnings group attendance
  baptisms: String,                      // Number of baptisms
  mealsServed: String,                   // Number of meals served
  salesFromBooks: String,                // Book sales total
  foodDonation: String,                  // Value of donated food
}, { timestamps: true });                // Adds createdAt and updatedAt timestamps

/*
  This schema was used for legacy reports before data types were standardized.
  All values are stored as strings and may require parsing in newer systems.
*/
module.exports = mongoose.model('Report', reportSchema);