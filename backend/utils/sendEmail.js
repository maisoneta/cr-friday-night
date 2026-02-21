// File: backend/utils/sendEmail.js
// Uses Resend (HTTPS API) - compatible with Render free tier (no SMTP ports)
const { Resend } = require('resend');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Escape HTML to prevent injection in email body
const escapeHtml = (str) => {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

// Convert a date into military-style format (e.g., 22APR25)
const formatDateMilitary = (input) => {
  if (!input) return '[Missing Date]';
  const iso = typeof input === 'string' ? input : input.toISOString();
  const d = new Date(new Date(iso).toISOString().split('T')[0] + 'T12:00:00Z');
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const year = String(d.getFullYear()).slice(-2);
  return `${day}${month}${year}`;
};

// Readable date format for subject/header (e.g., 10 Feb 26)
const formatDateReadable = (input) => {
  if (!input) return '[Missing Date]';
  const iso = typeof input === 'string' ? input : input.toISOString();
  const d = new Date(new Date(iso).toISOString().split('T')[0] + 'T12:00:00Z');
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = String(d.getFullYear()).slice(-2);
  return `${day} ${month} ${year}`;
};

/**
 * Send the CR Final Report email via Resend.
 * Env vars: RESEND_API_KEY, RESEND_FROM, EMAIL_TO
 * EMAIL_TO: single address or comma-separated (e.g. "a@x.com, b@x.com, c@x.com") — max 50.
 * Resend uses HTTPS - works on Render free tier (SMTP ports are blocked).
 */
const sendReportEmail = async (reportData) => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.RESEND_FROM;
  const toRaw = process.env.EMAIL_TO;

  // Parse EMAIL_TO: support single or comma-separated addresses
  const toAddresses = toRaw
    ? toRaw.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  if (!apiKey) {
    const err = new Error('Report saved but the notification email failed to send. (RESEND_API_KEY is not configured.)');
    err.code = 'EMAIL_FAILED';
    throw err;
  }
  if (!fromAddress || toAddresses.length === 0) {
    const err = new Error('Report saved but the notification email failed to send. (RESEND_FROM and EMAIL_TO must be set.)');
    err.code = 'EMAIL_FAILED';
    throw err;
  }

  // Use "Celebrate Recovery Report" as sender display name; keep email from RESEND_FROM
  const emailMatch = fromAddress.match(/<([^>]+)>/);
  const fromEmail = emailMatch ? emailMatch[1] : fromAddress;
  const fromDisplay = `Celebrate Recovery Report <${fromEmail}>`;

  const {
    date,
    largeGroupChurch,
    children,
    childrenWorkers,
    blueChips,
    donations,
    salesFromBooks,
    foodDonation,
    mealsServed,
    teens,
    mensLifeIssues,
    mensAddiction,
    womensAddiction,
    womensLifeIssues,
    newBeginnings,
    baptisms,
    stepStudyGraduates,
    comment,
  } = reportData;

  const formattedDate = formatDateMilitary(date);
  const readableDate = formatDateReadable(date);
  const totalAttendance = (largeGroupChurch || 0) + (children || 0) + (childrenWorkers || 0);
  const totalFunds = (donations || 0) + (salesFromBooks || 0) + (foodDonation || 0);
  const totalSmallGroup = (teens || 0) + (mensLifeIssues || 0) + (mensAddiction || 0) + (womensAddiction || 0) + (womensLifeIssues || 0) + (newBeginnings || 0);
  const fmtNum = (n) => (n ?? 0).toLocaleString();
  const fmtCurr = (n) => '$' + (n ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const row = (label, value) =>
    `<tr><td style="padding:6px 12px;border-bottom:1px solid #e8e8e8;color:#333;">${escapeHtml(label)}</td><td style="padding:6px 12px;border-bottom:1px solid #e8e8e8;text-align:right;font-weight:600;color:#1B4965;">${escapeHtml(value)}</td></tr>`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;font-family:'Segoe UI',Arial,sans-serif;background:#f5f5f5;padding:20px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#008B8B 0%,#1B4965 100%);padding:24px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:1.5rem;font-weight:600;">Celebrate Recovery Friday Night</h1>
      <p style="margin:8px 0 0 0;color:rgba(255,255,255,0.9);font-size:1rem;">Report ${escapeHtml(readableDate)}</p>
    </div>
    <div style="padding:24px;">
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <thead><tr><th colspan="2" style="text-align:left;padding:10px 12px;background:#f0f8f8;color:#008B8B;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em;">Attendance</th></tr></thead>
        <tbody>
          ${row('Large Group (Church)', fmtNum(largeGroupChurch))}
          ${row('Children', fmtNum(children))}
          ${row('Workers', fmtNum(childrenWorkers))}
          ${row('Total Attendance', fmtNum(totalAttendance))}
        </tbody>
      </table>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <thead><tr><th colspan="2" style="text-align:left;padding:10px 12px;background:#f0f8f8;color:#008B8B;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em;">Financials</th></tr></thead>
        <tbody>
          ${row('Donations', fmtCurr(donations))}
          ${row('Sales from Books', fmtCurr(salesFromBooks))}
          ${row('Food Donation', fmtCurr(foodDonation))}
          ${row('Total Funds', fmtCurr(totalFunds))}
        </tbody>
      </table>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <thead><tr><th colspan="2" style="text-align:left;padding:10px 12px;background:#f0f8f8;color:#008B8B;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em;">Participation</th></tr></thead>
        <tbody>
          ${row('Meals Served', fmtNum(mealsServed))}
          ${row('Blue Chips', fmtNum(blueChips))}
          ${row('Teens', fmtNum(teens))}
          ${row("Men's Life Issues", fmtNum(mensLifeIssues))}
          ${row("Men's Addiction", fmtNum(mensAddiction))}
          ${row("Women's Addiction", fmtNum(womensAddiction))}
          ${row("Women's Life Issues", fmtNum(womensLifeIssues))}
          ${row('New Beginnings', fmtNum(newBeginnings))}
          ${row('Total Small Group', fmtNum(totalSmallGroup))}
        </tbody>
      </table>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <thead><tr><th colspan="2" style="text-align:left;padding:10px 12px;background:#f0f8f8;color:#008B8B;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em;">Milestones</th></tr></thead>
        <tbody>
          ${row('Baptisms', fmtNum(baptisms))}
          ${row('Step Study Graduates', fmtNum(stepStudyGraduates))}
        </tbody>
      </table>
      <div style="background:#f9f9f9;border-left:4px solid #008B8B;padding:14px 16px;border-radius:0 8px 8px 0;">
        <p style="margin:0 0 6px 0;font-size:0.8rem;color:#666;text-transform:uppercase;letter-spacing:0.04em;">Comment</p>
        <p style="margin:0;color:#333;line-height:1.5;">${escapeHtml(comment || 'No comment provided')}</p>
      </div>
    </div>
    <div style="padding:12px 24px;background:#f5f5f5;text-align:center;font-size:0.8rem;color:#888;">Celebrate Recovery Friday Night • Report submitted automatically</div>
  </div>
</body>
</html>`;

  // Short summary email — executive report with only these categories
  const htmlShort = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;font-family:'Segoe UI',Arial,sans-serif;background:#f5f5f5;padding:16px;">
  <div style="max-width:400px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
    <div style="background:#008B8B;padding:16px;text-align:center;">
      <h2 style="margin:0;color:#fff;font-size:1.2rem;font-weight:600;">Celebrate Recovery Canyon Ridge Report: ${escapeHtml(readableDate)}</h2>
    </div>
    <div style="padding:20px;font-size:1rem;line-height:1.8;color:#333;">
      <p style="margin:0 0 6px 0;"><strong>Large Group:</strong> ${fmtNum(largeGroupChurch)}</p>
      <p style="margin:0 0 6px 0;"><strong>Children:</strong> ${fmtNum(children)}</p>
      <p style="margin:0 0 6px 0;"><strong>Workers:</strong> ${fmtNum(childrenWorkers)}</p>
      <p style="margin:0 0 6px 0;"><strong>Total Attendance:</strong> ${fmtNum(totalAttendance)}</p>
      <p style="margin:0 0 6px 0;"><strong>Total Funds:</strong> ${fmtCurr(totalFunds)}</p>
      <p style="margin:0 0 6px 0;"><strong>Meals Served:</strong> ${fmtNum(mealsServed)}</p>
      <p style="margin:0 0 0 0;"><strong>Total Small Group:</strong> ${fmtNum(totalSmallGroup)}</p>
    </div>
    <div style="padding:16px 20px;text-align:center;font-size:0.95rem;color:#333;">Celebrate Recovery Canyon Ridge</div>
  </div>
</body>
</html>`;

  try {
    const resend = new Resend(apiKey);

    // 1. Full report
    const { data, error } = await resend.emails.send({
      from: fromDisplay,
      to: toAddresses,
      subject: `Celebrate Recovery Friday Night Report ${escapeHtml(readableDate)}`,
      html,
    });

    if (error) {
      console.error('❌ Resend error (full report):', JSON.stringify(error, null, 2));
      const emailError = new Error(
        `Report saved but the notification email failed to send. ${error.message || ''}`
      );
      emailError.code = 'EMAIL_FAILED';
      throw emailError;
    }
    console.log('✅ Full report email sent via Resend. ID:', data?.id);

    // 2. Short summary
    const { data: data2, error: error2 } = await resend.emails.send({
      from: fromDisplay,
      to: toAddresses,
      subject: `Celebrate Recovery Canyon Ridge Report ${escapeHtml(readableDate)}`,
      html: htmlShort,
    });

    if (error2) {
      console.error('❌ Resend error (short summary):', JSON.stringify(error2, null, 2));
      // Don't throw - full report was sent; log and continue
    } else {
      console.log('✅ Short summary email sent via Resend. ID:', data2?.id);
    }
  } catch (err) {
    if (err.code === 'EMAIL_FAILED') throw err;
    console.error('❌ Failed to send report email:', err.message);
    const emailError = new Error('Report saved but the notification email failed to send.');
    emailError.code = 'EMAIL_FAILED';
    throw emailError;
  }
};

module.exports = sendReportEmail;
