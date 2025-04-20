import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

const AppLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="app-layout">
      <main style={{ paddingBottom: '4rem' }}>
        <Outlet />
      </main>

      {/* Floating Add Button */}
      <button className="fab-button" onClick={() => navigate('/dynamic-entry')}>
        ➕
      </button>

      <NavBar />
    </div>
  );
};

export default AppLayout;