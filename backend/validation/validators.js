/**
 * Input validation for CR API routes.
 * Uses express-validator for sanitization and validation.
 */

const { body, param, validationResult } = require('express-validator');

// Allowed field types for pending entries (must match frontend fieldConfig)
const ALLOWED_TYPES = [
  'largeGroupChurch', 'children', 'childrenWorkers',
  'donations', 'salesFromBooks', 'foodDonation',
  'teens', 'mensLifeIssues', 'mensAddiction', 'womensAddiction',
  'womensLifeIssues', 'newBeginnings', 'baptisms', 'blueChips',
  'mealsServed', 'stepStudyGraduates'
];

// Numeric fields used in reports (for validation)
const REPORT_NUMERIC_FIELDS = [
  'largeGroupChurch', 'children', 'childrenWorkers', 'blueChips',
  'donations', 'salesFromBooks', 'bookSales', 'foodDonation',
  'mealsServed', 'teens', 'mensLifeIssues', 'mensAddiction',
  'womensAddiction', 'womensLifeIssues', 'newBeginnings', 'baptisms', 'stepStudyGraduates'
];

const MAX_VALUE = 99999;       // Reasonable upper bound for counts/dollars
const MAX_COMMENT_LEN = 500;
const MAX_SUBMITTED_BY_LEN = 100;
const MAX_GROUP_LEN = 200;

/** Returns 400 JSON with validation errors, or null if valid */
function handleValidationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(e => e.msg).join('; ');
    res.status(400).json({ message: messages });
    return true;
  }
  return false;
}

// ----- Pending validators -----

const validatePendingPost = [
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Invalid date format')
    .toDate(),
  body('type')
    .notEmpty().withMessage('Type is required')
    .isIn(ALLOWED_TYPES).withMessage('Invalid field type'),
  body('value')
    .exists({ checkFalsy: false }).withMessage('Value is required')
    .isNumeric().withMessage('Value must be a number')
    .toFloat()
    .isFloat({ min: 0, max: MAX_VALUE }).withMessage(`Value must be between 0 and ${MAX_VALUE}`),
  body('comment')
    .optional({ values: 'falsy' })
    .isString().withMessage('Comment must be a string')
    .isLength({ max: MAX_COMMENT_LEN }).withMessage(`Comment must be ${MAX_COMMENT_LEN} characters or less`),
  body('group')
    .optional({ values: 'falsy' })
    .isString().withMessage('Group must be a string')
    .isLength({ max: MAX_GROUP_LEN }).withMessage(`Group must be ${MAX_GROUP_LEN} characters or less`),
  body('replace')
    .optional()
    .isBoolean().withMessage('Replace must be true or false')
];

const validatePendingGet = [
  param('date')
    .notEmpty().withMessage('Date is required')
    .matches(/^\d{4}-\d{2}-\d{2}/).withMessage('Invalid date format (use YYYY-MM-DD)')
];

// ----- Reports validators -----

const validateReportPost = [
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Invalid date format')
    .toDate(),
  body('comment')
    .optional({ values: 'falsy' })
    .isString().withMessage('Comment must be a string')
    .isLength({ max: MAX_COMMENT_LEN }).withMessage(`Comment must be ${MAX_COMMENT_LEN} characters or less`),
  body('submittedBy')
    .optional({ values: 'falsy' })
    .isString().withMessage('submittedBy must be a string')
    .isLength({ max: MAX_SUBMITTED_BY_LEN }).withMessage(`submittedBy must be ${MAX_SUBMITTED_BY_LEN} characters or less`)
];

// Add validation for each numeric report field
REPORT_NUMERIC_FIELDS.forEach(field => {
  validateReportPost.push(
    body(field)
      .optional({ values: 'falsy' })
      .isNumeric().withMessage(`${field} must be a number`)
      .toFloat()
      .isFloat({ min: 0, max: MAX_VALUE }).withMessage(`${field} must be between 0 and ${MAX_VALUE}`)
  );
});

module.exports = {
  handleValidationErrors,
  validatePendingPost,
  validatePendingGet,
  validateReportPost,
  ALLOWED_TYPES
};
