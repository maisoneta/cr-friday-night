// frontend/src/App.js
import React, { useState } from 'react';
import CRDashboard from './components/CRDashboard';
import CRForm from './CRForm';

function App() {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleFormSubmitted = () => {
    setRefreshFlag((prev) => !prev); // toggle to trigger useEffect
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-6">CR Friday Night Numbers</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Submit New Report</h2>
          <CRForm onSubmitSuccess={handleFormSubmitted} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
          <CRDashboard refreshFlag={refreshFlag} />
        </div>
      </div>
    </div>
  );
}

export default App;