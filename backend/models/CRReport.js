// ✅ Import Mongoose: a MongoDB object modeling tool
const mongoose = require('mongoose');

// ✅ Define the schema for Celebrate Recovery Reports
const CRReportSchema = new mongoose.Schema(
  {
    // ✅ Report Date
    // The date of the Celebrate Recovery Friday night event
    date: {
      type: Date,
      required: true,
    },

    // ✅ Attendance: Main Group & Children
    largeGroupChurch: {
      type: Number,
      default: 0,
    },
    children: {
      type: Number,
      default: 0,
    },
    childrenWorkers: {
      type: Number,
      default: 0,
    },

    // ✅ Participation Metrics
    blueChips: {              // ✅ Blue Chips (first-time visitors)
      type: Number,
      default: 0,
    },
    donations: {              // ✅ General donations collected
      type: Number,
      default: 0,
    },

    // ✅ Small Group Attendance
    teens: {                  // ✅ Teens attending The Landing
      type: Number,
      default: 0,
    },
    mensLifeIssues: {         // ✅ Men's Life Issues group
      type: Number,
      default: 0,
    },
    mensAddiction: {          // ✅ Men's Addiction group
      type: Number,
      default: 0,
    },
    womensAddiction: {        // ✅ Women's Addiction group
      type: Number,
      default: 0,
    },
    womensLifeIssues: {       // ✅ Women's Life Issues group
      type: Number,
      default: 0,
    },
    newBeginnings: {          // ✅ Newcomers orientation group
      type: Number,
      default: 0,
    },

    // ✅ Special Events & Activity Metrics
    baptisms: {               // ✅ Baptisms held during this session
      type: Number,
      default: 0,
    },
    mealsServed: {            // ✅ Meals served during the evening
      type: Number,
      default: 0,
    },
    bookSales: {              // ✅ Sales from Celebrate Recovery books
      type: Number,
      default: 0,
    },
    salesFromBooks: {         // ✅ Duplicate tracking for book sales (used in some reports)
      type: Number,
      default: 0,
    },
    foodDonation: {           // ✅ Estimated dollar value of food donated
      type: Number,
      default: 0.0,
      get: v => parseFloat(v),
      set: v => parseFloat(v),
    },
    stepStudyGraduates: {     // ✅ Number of Step Study graduates
      type: Number,
      default: 0,
    },

    // ✅ Calculated Summary Fields
    totalFunds: {             // ✅ Total monetary contributions (donations + books + food)
      type: Number,
      default: 0,
    },
    totalAttendance: {        // ✅ Total of largeGroupChurch + children + childrenWorkers
      type: Number,
      default: 0,
    },
    totalSmallGroup: {        // ✅ Sum of all small group participants
      type: Number,
      default: 0,
    },

    // ✅ Admin Controls
    approved: {               // ✅ Indicates if report has been reviewed and approved
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // ✅ Automatically add `createdAt` and `updatedAt` timestamps
  }
);

// ✅ Export the Mongoose model so it can be used in routes and controllers
module.exports = mongoose.model('CRReport', CRReportSchema);