// File: frontend/src/components/NavBar.jsx

/*
  Bottom navigation bar component with links to all main app pages.
  Uses react-router NavLink to enable route-aware styling.
*/

import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      {/* Link to Home page */}
      <NavLink to="/" className="nav-item">
        <span role="img" aria-label="home">🏠</span>
        <span>Home</span>
      </NavLink>
      {/* Link to Review/Submit page */}
      <NavLink to="/review" className="nav-item">
        <span role="img" aria-label="review">📝</span>
        <span>Review/Submit</span>
      </NavLink>
      {/* Link to Dashboard */}
      <NavLink to="/dashboard" className="nav-item">
        <span role="img" aria-label="dashboard">📊</span>
        <span>Dashboard</span>
      </NavLink>
      {/* Link to Graphs page */}
      <NavLink to="/graphs" className="nav-item">
        <span role="img" aria-label="graphs">📈</span>
        <span>Graphs</span>
      </NavLink>
    </nav>
  );
};

export default NavBar;
