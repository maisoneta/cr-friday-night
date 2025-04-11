const express = require('express');
const router = express.Router();
const CRReport = require('../models/CRReport');

// POST: Create a new report
router.post('/', async (req, res) => {
  try {
    const report = new CRReport(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    console.error('Error creating report:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: Fetch all reports
router.get('/', async (req, res) => {
  try {
    const reports = await CRReport.find().sort({ date: -1 });
    res.status(200).json(reports);
  } catch (err) {
    console.error('Error fetching reports:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;