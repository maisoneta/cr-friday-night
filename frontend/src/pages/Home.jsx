// File: frontend/src/pages/Home.jsx

/*
  Home page for the Celebrate Recovery app.
  Displays logo and navigation buttons linking to:
  - Group data entry
  - Review and submission
  - Dashboard overview
  - Graph visualizations
*/
import React from 'react';
import { Link } from 'react-router-dom';
import CRLogo from '../assets/CR_CanyonRidge_Logo.png';

const Home = () => {
  return (
    <div className="home-page">
      <div className="home-card">
        <img
          src={CRLogo}
          alt="Canyon Ridge Celebrate Recovery Logo"
          className="home-logo"
        />
        <p className="home-tagline">Friday Night Data Portal</p>
        <nav className="home-nav">
          <Link to="/dynamic-entry" className="home-link">
            <span className="home-link-icon">🧑‍🤝‍🧑</span>
            Add Group Data
          </Link>
          <Link to="/review" className="home-link">
            <span className="home-link-icon">📝</span>
            Review/Submit
          </Link>
          <Link to="/dashboard" className="home-link">
            <span className="home-link-icon">📊</span>
            View Dashboard
          </Link>
          <Link to="/graphs" className="home-link">
            <span className="home-link-icon">📈</span>
            Graphs
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Home;
