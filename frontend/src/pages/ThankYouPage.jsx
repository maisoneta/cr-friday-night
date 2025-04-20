import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const ThankYouPage = () => {
  const location = useLocation();
  const { date, fields } = location.state || {};

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2>🎉 Thank You for Submitting!</h2>
      <p>You've successfully submitted the following report for:</p>
      <p><strong>Date:</strong> {date}</p>

      <ul style={{ marginTop: '1rem' }}>
        {fields &&
          Object.entries(fields).map(([field, value]) => (
            <li key={field}>
              <strong>{field}</strong>: {value}
            </li>
          ))}
      </ul>

      <div style={{ marginTop: '2rem' }}>
        <Link to="/entry">
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