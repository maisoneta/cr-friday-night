// ✅ Import Mongoose, which provides a schema-based solution to model MongoDB data
const mongoose = require('mongoose');

// ✅ Define the schema for Celebrate Recovery Reports
const CRReportSchema = new mongoose.Schema(
  {
    // 📅 Date the report was created (typically represents a Friday CR night)
    date: {
      type: Date,
      required: true,
    },

    // ✅ Large Group Attendance
    largeGroupChurch: {
      type: Number,
      default: 0,
    },

    // ✅ Children & Workers (those present in childcare programs)
    children: {
      type: Number,
      default: 0,
    },
    childrenWorkers: {
      type: Number,
      default: 0,
    },

    // ✅ Miscellaneous Metrics
    blueChips: {              // # of blue chips handed out (Newcomers)
      type: Number,
      default: 0,
    },
    donations: {              // Dollar amount received as donations
      type: Number,
      default: 0,
    },

    // ✅ Small Group Participation
    teens: {                  // # of teenagers attending The Landing
      type: Number,
      default: 0,
    },
    mensLifeIssues: {         // Men's Life Issues group attendance
      type: Number,
      default: 0,
    },
    mensAddiction: {          // Men's Addiction group attendance
      type: Number,
      default: 0,
    },
    womensAddiction: {        // Women's Addiction group attendance
      type: Number,
      default: 0,
    },
    womensLifeIssues: {       // Women's Life Issues group attendance
      type: Number,
      default: 0,
    },
    newBeginnings: {          // Newcomers orientation group
      type: Number,
      default: 0,
    },

    // ✅ Special Metrics
    baptisms: {               // # of baptisms during that session
      type: Number,
      default: 0,
    },
    mealsServed: {            // Total meals provided during the night
      type: Number,
      default: 0,
    },
    bookSales: {              // Amount received from Celebrate Recovery book sales
      type: Number,
      default: 0,
    },
    salesFromBooks: {         // Same amount stored under consistent backend name
      type: Number,
      default: 0,
    },
    foodDonation: {           // Dollar value of donated food
      type: Number,
      default: 0,
    },
    stepStudyGraduates: {
      type: Number,
      default: 0,
    },
    totalFunds: {
      type: Number,
      default: 0,
    },
    // ✅ Admin-only: mark report as approved or not
    approved: {
      type: Boolean,
      default: false,
    },
    totalAttendance: {
      type: Number,
      default: 0,
    },
    totalSmallGroup: {
      type: Number,
      default: 0,
    },

  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields to each document
  }
);

// ✅ Export the Mongoose model for use in routes/controllers
module.exports = mongoose.model('CRReport', CRReportSchema);