import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBAR.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-item">
        <span role="img" aria-label="home">🏠</span>
        <span>Home</span>
      </NavLink>
      <NavLink to="/review" className="nav-item">
        <span role="img" aria-label="review">📝</span>
        <span>M. Review and Finalize Report</span>
      </NavLink>
      <NavLink to="/dynamic-entry" className="nav-item">
        <span role="img" aria-label="add">➕</span>
        <span>Individual Team Data</span>
      </NavLink>
      <NavLink to="/dashboard" className="nav-item">
        <span role="img" aria-label="dashboard">📊</span>
        <span>Dashboard</span>
      </NavLink>
    </nav>
  );
};

export default NavBar;
