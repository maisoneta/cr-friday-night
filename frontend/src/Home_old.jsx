
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Celebrate Recovery Friday Night Tracker</h1>
      <p style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
        A simple tool to help track attendance, donations, meals, and life change through your CR ministry.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/form">
          <button style={{ padding: '1rem', fontSize: '1rem' }}>Submit a New Report</button>
        </Link>
        <Link to="/dashboard">
          <button style={{ padding: '1rem', fontSize: '1rem' }}>View Dashboard</button>
        </Link>
        <Link to="/dynamic-entry">
          <button style={{ padding: '1rem', fontSize: '1rem' }}>Team Data Entry</button>
        </Link>
        <Link to="/review">
          <button style={{ padding: '1rem', fontSize: '1rem' }}>Review & Finalize Report</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
