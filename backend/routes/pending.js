// backend/routes/pending.js

const express = require('express');
const router = express.Router();
const PendingReport = require('../models/PendingReport');
const { handleValidationErrors, validatePendingPost, validatePendingGet } = require('../validation/validators');

/**
 * POST /api/pending
 * Save partial data input to holding (pending) collection.
 * - Only one (date, type) pair is allowed per pending entry.
 * - Responds with 409 if a duplicate is found.
 */
router.post('/', validatePendingPost, async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  let { date, type, value, comment = '', group = '', replace = false } = req.body;

  // Normalize date to YYYY-MM-DD (validator may have converted to Date object)
  if (date && typeof date !== 'string') {
    date = date.toISOString().split('T')[0];
  } else if (date) {
    try {
      date = new Date(date).toISOString().split('T')[0];
    } catch (e) {
      return res.status(400).json({ message: 'Invalid date format.' });
    }
  }

  try {
    // If replace is true, delete existing entry for this (date, type) first
    if (replace) {
      await PendingReport.deleteOne({ date, type });
    }

    // Save the new pending entry (comment and group are optional)
    const entry = new PendingReport({ date, type, value, comment, group });
    await entry.save();
    res.status(201).json({ message: 'Pending entry saved', entry });
  } catch (error) {
    // DUPLICATE KEY ERROR: Send friendly 409 Conflict with clear message
    if (
      error.code === 11000 ||
      (error.message && error.message.includes('duplicate key')) ||
      (error.writeErrors && error.writeErrors[0] && error.writeErrors[0].code === 11000)
    ) {
      return res.status(409).json({
        message:
          "Someone has already submitted this section for the selected date. " +
          "Please check if you chose the right section and date, or contact the leader if you think this is a mistake."
      });
    }

    // Log server-side only; do not expose internal details to client
    console.error('Error saving pending entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/pending/:date
 * Retrieve all pending entries for a specific date.
 */
router.get('/:date', validatePendingGet, async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  let { date } = req.params;
  // Normalize date param to YYYY-MM-DD
  try {
    date = new Date(date).toISOString().split('T')[0];
  } catch (e) {
    return res.status(400).json({ message: 'Invalid date format.' });
  }

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