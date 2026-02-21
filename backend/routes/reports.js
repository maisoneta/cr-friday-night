// ✅ Import Express framework to build route handlers
const express = require('express');
const router = express.Router();

// ✅ Import models
const CRReport = require('../models/CRReport');
const PendingReport = require('../models/PendingReport');

// ✅ Import the email sender utility
const sendReportEmail = require('../utils/sendEmail');
const { handleValidationErrors, validateReportPost } = require('../validation/validators');

// ==============================
// POST /api/reports
// ✅ Create a new finalized Celebrate Recovery report
// ==============================
router.post('/', validateReportPost, async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const {
      date,
      comment,
      submittedBy = 'admin',
      donations = 0,
      salesFromBooks,
      bookSales,
      foodDonation = 0,
      approved,
      ...reportFields
    } = req.body;
    // Exclude 'approved' - only server/admin can set it; clients must not override

    // 🔒 Check if a report already exists for the same date
    const existingReport = await CRReport.findOne({ date });
    if (existingReport) {
      return res.status(409).json({ message: 'A report has already been submitted for this date.' });
    }
    
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

    // ✅ Save final report to database (approved is excluded from req.body; uses schema default false)
    const report = new CRReport({
      date,
      donations,
      salesFromBooks: finalBookSales,
      bookSales: Number(bookSales ?? salesFromBooks ?? 0),
      foodDonation,
      ...reportFields,
      comment,
      submittedBy,
      totalFunds,
      totalAttendance,
      totalSmallGroup,
    });

    await report.save();

    // ✅ Clear matching pending entries for that date (PendingReport uses string YYYY-MM-DD)
    const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
    await PendingReport.deleteMany({ date: dateStr });

    // ✅ Trigger email summary
    await sendReportEmail(report.toObject());

    res.status(201).json({
      message: 'Final report saved, email sent, and pending entries cleared.',
      report,
    });
  } catch (err) {
    console.error('❌ Error saving report:', err.message);
    const message = err.code === 'EMAIL_FAILED'
      ? err.message
      : 'Server error saving report.';
    res.status(500).json({ message });
  }
});

// ==============================
// GET /api/reports
// ✅ Fetch Celebrate Recovery final reports (paginated)
// Query params: ?page=1&limit=100 (default limit 100, max 200)
// ==============================
router.get('/', async (req, res) => {
  try {
    const rawPage = parseInt(req.query.page, 10);
    const rawLimit = parseInt(req.query.limit, 10);
    const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
    const limit = Number.isFinite(rawLimit) && rawLimit > 0
      ? Math.min(200, rawLimit)
      : 100;
    const skip = (page - 1) * limit;

    const reports = await CRReport.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(reports);
  } catch (err) {
    console.error('❌ Error fetching reports:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;