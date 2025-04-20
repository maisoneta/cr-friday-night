import React, { useEffect, useState } from 'react';
import '../components/CRDashboard.css';

const CRDashboard = () => {
  const [reports, setReports] = useState([]);
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
  const [allYears, setAllYears] = useState([]);
  const [totals, setTotals] = useState({});
  const [averages, setAverages] = useState({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch('http://localhost:5002/api/reports');
        const data = await res.json();

        const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
        setReports(sorted.slice(0, 12));

        const years = Array.from(new Set(data.map(r => new Date(r.date).getFullYear()))).sort((a, b) => b - a);
        setAllYears(years);

        const yearFiltered = data.filter(r => new Date(r.date).getFullYear() === displayYear);
        const totalObj = {};
        const count = yearFiltered.length;

        yearFiltered.forEach((report) => {
          Object.keys(report).forEach((key) => {
            if (typeof report[key] === 'number') {
              totalObj[key] = (totalObj[key] || 0) + report[key];
            }
          });
        });

        const avgObj = {};
        Object.keys(totalObj).forEach((key) => {
          avgObj[key] = (totalObj[key] / count).toFixed(1);
        });

        setTotals(totalObj);
        setAverages(avgObj);
      } catch (err) {
        console.error('Error fetching reports:', err);
      }
    };

    fetchInitialData();
  }, [displayYear]);

  const displayFields = [
    { key: 'date', label: 'Date' },
    { key: 'largeGroupChurch', label: 'LgGp' },
    { key: 'children', label: 'Kid' },
    { key: 'childrenWorkers', label: 'Wrkr' },
    { key: 'totalAttendance', label: 'TotAttnd' },
    { key: 'donations', label: 'Don' },
    { key: 'bookSales', label: 'Book$' },
    { key: 'foodDonation', label: 'Food$' },
    { key: 'totalFunds', label: 'T-Funds' },
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
    { key: 'stepStudyGraduates', label: 'Grad' }
  ];

  const formatCell = (value, key) => {
    if (key === 'date') {
      return new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } else if (
      key.toLowerCase().includes('don') ||
      key.toLowerCase().includes('fund') ||
      key.toLowerCase().includes('book') ||
      key.toLowerCase().includes('food')
    ) {
      return `$${(value || 0).toFixed(2)}`;
    } else {
      return typeof value === 'number' ? value : value || '';
    }
  };

  return (
    <div className="cr-dashboard">
      <h2 className="dashboard-title">Celebrate Recovery Dashboard</h2>

      {/* ✅ Legend */}
      <div className="legend">
        <span><span className="legend-box legend-green" /> Above Average</span>
        <span><span className="legend-box legend-yellow" /> Below Average</span>
      </div>

      {/* ✅ Last 12 Entries Table */}
      <h3 className="table-header">Last 12 Entries</h3>
      <table className="cr-table">
        <thead>
          <tr>
            {displayFields.map((field) => (
              <th key={field.key}>{field.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reports.map((report, rowIndex) => (
            <tr key={rowIndex}>
              {displayFields.map((field) => {
                const rawValue = report[field.key];
                const avg = parseFloat(averages[field.key]);
                let className = '';

                if (typeof rawValue === 'number' && !isNaN(avg)) {
                  if (rawValue > avg) className = 'above-average';
                  else if (rawValue < avg) className = 'below-average';
                }

                return (
                  <td key={field.key} className={className}>
                    {formatCell(rawValue, field.key)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Year Selector */}
      <div className="year-selector">
        <label htmlFor="year">Select Year:</label>
        <select
          id="year"
          value={displayYear}
          onChange={(e) => setDisplayYear(parseInt(e.target.value))}
        >
          {allYears.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* ✅ YTD Totals and Averages Table */}
      <h3 className="table-header">YTD Totals & Averages</h3>
      <table className="cr-table">
        <thead>
          <tr>
            <th>Type</th>
            {displayFields.map((field) =>
              field.key !== 'date' && (
                <th key={field.key}>{field.label}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total</td>
            {displayFields.map((field) =>
              field.key !== 'date' && (
                <td key={field.key}>
                  {field.key.toLowerCase().includes('don') ||
                  field.key.toLowerCase().includes('fund') ||
                  field.key.toLowerCase().includes('book') ||
                  field.key.toLowerCase().includes('food')
                    ? `$${(totals[field.key] || 0).toFixed(2)}`
                    : totals[field.key] || 0}
                </td>
              )
            )}
          </tr>
          <tr>
            <td>Average</td>
            {displayFields.map((field) =>
              field.key !== 'date' && (
                <td key={field.key}>
                  {field.key.toLowerCase().includes('don') ||
                  field.key.toLowerCase().includes('fund') ||
                  field.key.toLowerCase().includes('book') ||
                  field.key.toLowerCase().includes('food')
                    ? `$${parseFloat(averages[field.key] || 0).toFixed(2)}`
                    : parseFloat(averages[field.key] || 0).toFixed(1)}
                </td>
              )
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CRDashboard;