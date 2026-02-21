// File: frontend/src/pages/ThankYouPage.jsx

/*
  ThankYouPage displays a confirmation message after form submission.
  Shows submitted date and field values.
  Provides navigation buttons to return home or submit another entry.
*/
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { fieldLabels } from '../fieldConfig';

// Access location state to retrieve submitted date and field data
const ThankYouPage = () => {
  const location = useLocation();
  const { date, fields } = location.state || {};

  // Fallback when accessed directly (no state from form submission)
  if (!date && !fields) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
        <h2>Thank You</h2>
        <p>No submission data to display. You may have arrived here directly.</p>
        <div style={{ marginTop: '2rem' }}>
          <Link to="/dynamic-entry">
            <button style={{ padding: '0.5rem 1rem' }}>Add Group Data</button>
          </Link>
          {' '}
          <Link to="/">
            <button style={{ padding: '0.5rem 1rem' }}>Return to Home</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2>Thank You for Submitting!</h2>
      <p>You've successfully submitted the following report for:</p>
      <p><strong>Date:</strong> {date}</p>

      <ul style={{ marginTop: '1rem' }}>
        {fields &&
          Object.entries(fields).map(([field, value]) => (
            <li key={field}>
              <strong>{fieldLabels[field] ?? field}</strong>: {value}
            </li>
          ))}
      </ul>

      <div style={{ marginTop: '2rem' }}>
        <Link to="/dynamic-entry">
          <button style={{ padding: '0.5rem 1rem' }}>Submit Another Entry</button>
        </Link>
        {' '}
        <Link to="/">
          <button style={{ padding: '0.5rem 1rem' }}>Return to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default ThankYouPage;