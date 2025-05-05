import React from 'react';
import { Link } from 'react-router-dom';
import CRLogo from '../assets/CR_CanyonRidge_Logo.png';

const Home = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <img
        src={CRLogo}
        alt="Canyon Ridge Celebrate Recovery Logo"
        style={{
          width: '120px',
          height: 'auto',
          marginBottom: '1rem',
        }}
      />
      {/*
      <h1 style={{ marginBottom: '1rem', color: '#333' }}>Data Portal</h1>
      <p style={{ maxWidth: '600px', margin: '0 auto 2rem', color: '#555' }}>
        Input attendance, donations, meals, baptisms for Celebrate Recovery
      </p>
      */}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <Link to="/dynamic-entry">
          <button style={buttonStyle}>🧑‍🤝‍🧑 Add Group Data</button>
        </Link>
        <Link to="/review">
          <button style={buttonStyle}>📝 Review/Submit</button>
        </Link>
        <Link to="/dashboard">
          <button style={buttonStyle}>📊 View Dashboard</button>
        </Link>
        <Link to="/graphs">
          <button style={buttonStyle}>📈 Graphs</button>
        </Link>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '1rem 1.5rem',
  fontSize: '1rem',
  fontWeight: 'bold',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  width: '250px',
  boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
  transition: 'background-color 0.3s ease',
};

export default Home;
