
const nodemailer = require('nodemailer');
require('dotenv').config();

// ✅ Create transport using Gmail + App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Robust formatting of date to military style (e.g., 22APR25)
const formatDateMilitary = (input) => {
  if (!input) return '[Missing Date]';
  const iso = typeof input === 'string' ? input : input.toISOString();
  const d = new Date(new Date(iso).toISOString().split('T')[0] + 'T12:00:00Z');
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const year = String(d.getFullYear()).slice(-2);
  return `${day}${month}${year}`;
};

// ✅ Send CR Report Email
const sendReportEmail = async (reportData) => {
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
    comment
  } = reportData;

  const formattedDate = formatDateMilitary(date);

  const html = `
    <h2>🎉 CR Report Submitted: ${formattedDate}</h2>
    <ul>
      <li><strong>Large Group:</strong> ${largeGroupChurch || 0}</li>
      <li><strong>Children:</strong> ${children || 0}</li>
      <li><strong>Workers:</strong> ${childrenWorkers || 0}</li>
      <li><strong>Total Attendance:</strong> ${(largeGroupChurch || 0) + (children || 0) + (childrenWorkers || 0)}</li>
      <li><strong>Blue Chips:</strong> ${blueChips || 0}</li>
      <li><strong>Donations:</strong> $${donations || 0}</li>
      <li><strong>Sales from Books:</strong> $${salesFromBooks || 0}</li>
      <li><strong>Food Donation:</strong> $${foodDonation || 0}</li>
      <li><strong>Total Funds:</strong> $${(donations || 0) + (salesFromBooks || 0) + (foodDonation || 0)}</li>
      <li><strong>Meals Served:</strong> ${mealsServed || 0}</li>
      <li><strong>Teens:</strong> ${teens || 0}</li>
      <li><strong>Men's Life Issues:</strong> ${mensLifeIssues || 0}</li>
      <li><strong>Men's Addiction:</strong> ${mensAddiction || 0}</li>
      <li><strong>Women's Addiction:</strong> ${womensAddiction || 0}</li>
      <li><strong>Women's Life Issues:</strong> ${womensLifeIssues || 0}</li>
      <li><strong>New Beginnings:</strong> ${newBeginnings || 0}</li>
      <li><strong>Total Small Group:</strong> ${(teens || 0) + (mensLifeIssues || 0) + (mensAddiction || 0) + (womensAddiction || 0) + (womensLifeIssues || 0) + (newBeginnings || 0)}</li>
      <li><strong>Baptisms:</strong> ${baptisms || 0}</li>
      <li><strong>Step Study Graduates:</strong> ${stepStudyGraduates || 0}</li>
    </ul>
    <p><strong>Comment:</strong> ${comment || '[No comment provided]'}</p>
  `;

  try {
    await transporter.sendMail({
      from: `"Celebrate Recovery Friday Night Numbers" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `🎯 Final CR Report: ${formattedDate}`,
      html,
    });
    console.log('✅ Report email sent successfully.');
  } catch (err) {
    console.error('❌ Failed to send report email:', err.message);
  }
};

module.exports = sendReportEmail;
