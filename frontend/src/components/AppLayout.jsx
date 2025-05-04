import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

/**
 * AppLayout serves as the main wrapper for all routes and page views.
 * It includes:
 *  - A floating action button to navigate users to the data entry page.
 *  - The persistent navigation bar at the bottom of every screen.
 *  - An <Outlet /> to display the content of the currently selected route.
 */
const AppLayout = () => {
  const navigate = useNavigate(); // Hook from React Router to programmatically navigate between routes

  return (
    <div className="app-layout">
      {/* Main content area for nested route rendering */}
      <main style={{ paddingBottom: '4rem' }}>
        <Outlet />
      </main>

      {/*
        Floating Action Button (FAB):
        - Purpose: Quick access to the dynamic data entry form.
        - Styling and placement controlled via CSS (.fab-button).
        - "➕" icon is simple and recognizable.
        - Text label added for accessibility and clarity.
      */}
      <button className="fab-button" onClick={() => navigate('/dynamic-entry')}>
        ➕
        <span className="fab-label">Add Group Data</span>
      </button>

      {/* Global bottom navigation menu for page switching */}
      <NavBar />
    </div>
  );
};

export default AppLayout;