import React, { useEffect, useState } from 'react';  // ✅ Importing necessary React hooks for managing component lifecycle and state
import '../components/CRDashboard.css';  // ✅ Importing the custom CSS file for styling the dashboard



const CRDashboard = () => {
  // ✅ Main functional component for rendering the Celebrate Recovery Dashboard
  const [reports, setReports] = useState([]);  // ✅ State to store all fetched reports from the backend
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());  // ✅ State to track the selected year for summary filtering
  
  // ✅ Format any number as a U.S. currency string
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '';
    return `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };
  useEffect(() => {
    // ✅ Fetch data from backend API when component mounts
    const fetchReports = async () => {
      // ✅ Async function to request reports from the backend API
      try {
        const response = await fetch('http://192.168.50.98:5002/api/reports');
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      }
    };

    fetchReports();
  }, []);

  const formatDate = (dateString) => {
  // ✅ Helper function to format dates into 'MMM DD, YYYY'
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const recentReports = [...reports]
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 12);
  // ✅ Get the latest 12 reports sorted by newest date first

  const yearFilteredReports = reports.filter(report => {
  // ✅ Filter reports to only those matching the selected year
    const year = new Date(report.date).getFullYear();
    return year === Number(selectedYear);
  });

  const fieldKeys = [
    { key: 'largeGroupChurch', label: 'LgGp' },
    { key: 'children', label: 'Kid' },
    { key: 'childrenWorkers', label: 'Wrkr' },
    { key: 'totalAttendance', label: 'TotAttnd' },
    { key: 'donations', label: 'Don' },
    { key: 'salesFromBooks', label: 'Book$' },
    { key: 'foodDonation', label: 'Food$' },
    { key: 'totalFunds', label: 'T-Funds' }, // ✅ This is the new line to add
    { key: 'mealsServed', label: 'Meal' },
    { key: 'blueChips', label: 'Chip' },
    { key: 'teens', label: 'Teen' },
    { key: 'mensLifeIssues', label: 'MLI' },
    { key: 'mensAddiction', label: 'MAdd' },
    { key: 'womensAddiction', label: 'WAdd' },
    { key: 'womensLifeIssues', label: 'WLI' },
    { key: 'newBeginnings', label: 'NB' },
    { key: 'totalSmallGroup', label: 'TSG' },
    { key: 'baptisms', label: 'Bap' },
    { key: 'stepStudyGraduates', label: 'Grad' },

  ];

  const calculateYearlyStats = (data) => {
    const totals = {};
    const averages = {};
    const count = data.length;

    fieldKeys.forEach(({ key }) => {
      totals[key] = data.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
      averages[key] = count ? (totals[key] / count).toFixed(1) : '0';
    });

    return { totals, averages };
  };

  const { totals, averages } = calculateYearlyStats(yearFilteredReports);

  const getAllYears = () => {
    const years = new Set(reports.map(r => new Date(r.date).getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
  };

  return (
    <div className="cr-dashboard">
      <h1 className="dashboard-title">Celebrate Recovery Dashboard</h1>

      <h2 className="table-header">Last 12 Entries</h2>
      <table className="cr-table">
        <thead>
          <tr>
            <th>Date</th>
            {fieldKeys.map(({ key, label }) => (
              <th key={key}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {recentReports.map((report, index) => (
            <tr key={index}>
              <td>{formatDate(report.date)}</td>
              {fieldKeys.map(({ key }) => (
                <td key={key}>
                  {['donations', 'salesFromBooks', 'foodDonation', 'totalFunds'].includes(key)
                    ? formatCurrency(report[key])
                    : report[key] ?? ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="table-header">Yearly Totals & Averages</h2>

      <div className="year-selector">
        <label htmlFor="year">Select Year: </label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {getAllYears().map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <table className="cr-table">
        <thead>
          <tr>
            <th></th>
            {fieldKeys.map(({ key, label }) => (
              <th key={key}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Avg</td>
            {fieldKeys.map(({ key }) => (
              <td key={key}>{['donations', 'salesFromBooks', 'foodDonation', 'totalFunds'].includes(key) ? formatCurrency(averages[key]) : averages[key]}</td>
            ))}
          </tr>
          <tr>
            <td>Total</td>
            {fieldKeys.map(({ key }) => (
              <td key={key}>{['donations', 'salesFromBooks', 'foodDonation', 'totalFunds'].includes(key) ? formatCurrency(totals[key]) : totals[key]}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CRDashboard;
