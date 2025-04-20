// routes/pending.js

const express = require('express');
const router = express.Router();
const PendingReport = require('../models/PendingReport');

// ✅ POST /api/pending - Save partial data input to holding collection
router.post('/', async (req, res) => {
  const { date, type, value } = req.body;

  if (!date || !type || value === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const entry = new PendingReport({ date, type, value });
    await entry.save();
    res.status(201).json({ message: 'Pending entry saved', entry });
  } catch (error) {
    console.error('Error saving pending entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET /api/pending/:date - Retrieve all pending entries for a specific date
router.get('/:date', async (req, res) => {
    const { date } = req.params;
  
    try {
      const entries = await PendingReport.find({ date });
  
      if (!entries || entries.length === 0) {
        return res.status(404).json({ message: 'No pending entries found for this date' });
      }
  
      res.status(200).json(entries);
    } catch (error) {
      console.error('Error fetching pending entries:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;