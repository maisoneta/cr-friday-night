// ✅ Import Express framework to build route handlers
const express = require('express');
const router = express.Router();

// ✅ Import models
const CRReport = require('../models/CRReport');
const PendingReport = require('../models/PendingReport');

// ✅ Import the email sender utility
const sendReportEmail = require('../utils/sendEmail');

// ==============================
// POST /api/reports
// ✅ Create a new finalized Celebrate Recovery report
// ==============================
router.post('/', async (req, res) => {

    // ✅ Log the raw incoming report body to help with debugging
    console.log('🚀 Incoming report:', req.body);

    // 🔒 Check if a report already exists for the same date
    const { date } = req.body;
    const existingReport = await CRReport.findOne({ date });
    if (existingReport) {
      return res.status(409).json({ message: 'A report has already been submitted for this date.' });
    }

  try {
    const {
      date,
      comment,
      submittedBy = 'admin',
      donations = 0,
      salesFromBooks,
      bookSales,
      foodDonation = 0,
      ...reportFields
    } = req.body;
    
    // ✅ Use fallback if salesFromBooks is not defined but bookSales is present
    const finalBookSales = Number(salesFromBooks ?? bookSales ?? 0);
    
    // ✅ Calculate totalFunds using the corrected book sales value
    const totalFunds = Number(donations) + finalBookSales + Number(foodDonation);

    // ✅ Calculate totalAttendance
    const totalAttendance =
      Number(reportFields.largeGroupChurch || 0) +
      Number(reportFields.children || 0) +
      Number(reportFields.childrenWorkers || 0);

    // ✅ Calculate totalSmallGroup
    const totalSmallGroup =
      Number(reportFields.teens || 0) +
      Number(reportFields.mensLifeIssues || 0) +
      Number(reportFields.mensAddiction || 0) +
      Number(reportFields.womensAddiction || 0) +
      Number(reportFields.womensLifeIssues || 0) +
      Number(reportFields.newBeginnings || 0);

    if (!date) {
      return res.status(400).json({ message: 'Report must include a date.' });
    }

    // ✅ Save final report to database
    const report = new CRReport({
      date,
      donations,
      salesFromBooks: finalBookSales,
      bookSales: Number(bookSales ?? salesFromBooks ?? 0), // ✅ explicitly add this line
      foodDonation,
      ...reportFields,
      comment,
      submittedBy,
      totalFunds,
      totalAttendance,
      totalSmallGroup,
    });

    await report.save();

    // ✅ Clear matching pending entries for that date
    await PendingReport.deleteMany({ date });

    // ✅ Trigger email summary
    await sendReportEmail(report.toObject());

    res.status(201).json({
      message: 'Final report saved, email sent, and pending entries cleared.',
      report,
    });
  } catch (err) {
    console.error('❌ Error saving report:', err.message);
    res.status(500).json({ message: 'Server error saving report.' });
  }
});

// ==============================
// GET /api/reports
// ✅ Fetch all Celebrate Recovery final reports
// ==============================
router.get('/', async (req, res) => {
  try {
    const reports = await CRReport.find().sort({ date: -1 });
    res.status(200).json(reports);
  } catch (err) {
    console.error('❌ Error fetching reports:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;