// Core React import for using JSX and component structure
import React from 'react';

// React Router imports for defining client-side navigation structure
import { HashRouter, Routes, Route } from 'react-router-dom';

// Import the layout component that wraps all routed pages
import AppLayout from './components/AppLayout';

// --- Page Views (Routed) ---
import Home from './pages/Home';
import CRForm from './pages/CRForm';
import CRDashboard from './pages/CRDashboard';
import ReviewPage from './pages/ReviewPage';
import DynamicEntryPage from './pages/DynamicEntryPage';
import ThankYouPage from './pages/ThankYouPage';

/*
 * Main App component:
 * - Wraps the app with HashRouter for static hosting (e.g., GitHub Pages, Render)
 * - Defines routes to render each page inside a shared layout (AppLayout)
 */
const App = () => {
  return (
    // HashRouter is used instead of BrowserRouter to ensure compatibility on static hosts like GitHub Pages or Render
    <HashRouter>
      {/* All routes for the application, wrapped by AppLayout */}
      <Routes>
        {/* This Route uses AppLayout as a wrapper for all child routes */}
        <Route element={<AppLayout />}>
          {/* Child routes rendered inside AppLayout */}
          <Route path="/" element={<Home />} />                    {/* Home page route */}
          <Route path="/form" element={<CRForm />} />              {/* Main CR Form route */}
          <Route path="/dashboard" element={<CRDashboard />} />    {/* Dashboard route showing reports */}
          <Route path="/review" element={<ReviewPage />} />        {/* Review and finalize page */}
          <Route path="/dynamic-entry" element={<DynamicEntryPage />} />  {/* Individual entry input route */}
          <Route path="/thank-you" element={<ThankYouPage />} />   {/* Thank you confirmation page */}
        </Route>
      </Routes>
    </HashRouter>
  );
};

// Export the App component so it can be rendered in index.js
export default App;
