const mongoose = require('mongoose');

const CRReportSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
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
    blueChips: {
      type: Number,
      default: 0,
    },
    donations: {
      type: Number,
      default: 0,
    },
    teens: {
      type: Number,
      default: 0,
    },
    mensLifeIssues: {
      type: Number,
      default: 0,
    },
    mensAddiction: {
      type: Number,
      default: 0,
    },
    womensAddiction: {
      type: Number,
      default: 0,
    },
    womensLifeIssues: {
      type: Number,
      default: 0,
    },
    newBeginnings: {
      type: Number,
      default: 0,
    },
    baptisms: {
      type: Number,
      default: 0,
    },
    mealsServed: {
      type: Number,
      default: 0,
    },
    bookSales: {
      type: Number,
      default: 0,
    },
    foodDonation: {
      type: Number,
      default: 0,
    },
    approved: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CRReport', CRReportSchema);