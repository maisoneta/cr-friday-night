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
        <span>Review/Submit</span>
      </NavLink>
      <NavLink to="/dashboard" className="nav-item">
        <span role="img" aria-label="dashboard">📊</span>
        <span>Dashboard</span>
      </NavLink>
      <NavLink to="/graphs" className="nav-item">
        <span role="img" aria-label="graphs">📈</span>
        <span>Graphs</span>
      </NavLink>
    </nav>
  );
};

export default NavBar;
