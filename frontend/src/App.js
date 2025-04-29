import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';

import Home from './pages/Home';
import CRForm from './pages/CRForm';
import CRDashboard from './pages/CRDashboard';
import ReviewPage from './pages/ReviewPage';
import DynamicEntryPage from './pages/DynamicEntryPage';
import ThankYouPage from './pages/ThankYouPage';

const App = () => {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<CRForm />} />
          <Route path="/dashboard" element={<CRDashboard />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/dynamic-entry" element={<DynamicEntryPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App; 

