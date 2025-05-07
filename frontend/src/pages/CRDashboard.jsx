import React, { useEffect, useState } from 'react';
import '../components/CRDashboard.css'; // Import styles specific to the CR dashboard
import { API_BASE_URL } from '../config'; // Base API URL for backend communication

// CRDashboard displays Celebrate Recovery attendance and contribution stats
const CRDashboard = () => {
  // Stores the full list of reports from the backend
  const [reports, setReports] = useState([]);
  const [allReports, setAllReports] = useState([]);
  // Stores the currently selected year to filter data
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
  // Stores all unique years found in report data
  const [allYears, setAllYears] = useState([]);
  // Stores total values for selected year
  const [totals, setTotals] = useState({});
  // Stores average values for selected year
  const [averages, setAverages] = useState({});

  // Fetch reports from the backend and process totals and averages
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/reports`);
        const data = await res.json();

        // Sort reports by date (newest first) and limit to last 12
        const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
        setAllReports(data); // full dataset for other calculations
        setReports(sorted.slice(0, 12)); // last 12 entries only

        // Extract and sort all unique years
        const years = Array.from(new Set(data.map(r => new Date(r.date).getFullYear()))).sort((a, b) => b - a);
        setAllYears(years);

        // Filter data by selected year
        const yearFiltered = data.filter(r => new Date(r.date).getFullYear() === displayYear);
        const totalObj = {};
        const count = yearFiltered.length;

        // Calculate total values for each numeric field
        yearFiltered.forEach((report) => {
          Object.keys(report).forEach((key) => {
            if (typeof report[key] === 'number') {
              totalObj[key] = (totalObj[key] || 0) + report[key];
            }
          });
        });

        // Calculate averages from totals
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
  }, [displayYear]); // Re-run when year changes

  // Configuration for the table fields (what to show and in what order)
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

  // Format individual cell values for display
  const formatCell = (value, key) => {
    if (key === 'date') {
      // Format dates to MM/DD/YYYY
      return new Date(value).toLocaleDateString('en-US', {
        timeZone: 'UTC',
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
      // Format currency values
      return `$${(value || 0).toFixed(2)}`;
    } else {
      // Show number or empty string
      return typeof value === 'number' ? value : value || '';
    }
  };

  // Calculate overall averages for all years/fields for highlighting in YoY table
  const allFieldSums = {};
  const allFieldCounts = {};

  allReports.forEach((r) => {
    Object.keys(r).forEach((key) => {
      if (typeof r[key] === 'number') {
        allFieldSums[key] = (allFieldSums[key] || 0) + r[key];
        allFieldCounts[key] = (allFieldCounts[key] || 0) + 1;
      }
    });
  });

  const overallAverages = {};
  Object.keys(allFieldSums).forEach((key) => {
    overallAverages[key] = allFieldSums[key] / allFieldCounts[key];
  });

  return (
    <div className="cr-dashboard">
      {/* Page Title */}
      <h2 className="dashboard-title">Celebrate Recovery Dashboard</h2>

      {/* Visual Legend for Value Highlights */}
      <div className="legend">
        <span><span className="legend-box legend-green" /> Above Average</span>
        <span><span className="legend-box legend-yellow" /> Below Average</span>
      </div>

      {/* Last 12 Entries Table */}
      <h3 className="table-header">Last 12 Entries</h3>
      <div className="table-scroll-container">
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

                  // Highlight above/below average values
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
      </div>

      {/* Year Selector Dropdown */}
      <h3 className="table-header">YTD Totals & Averages</h3>
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

      {/* YTD Data Table */}
      <div className="table-scroll-container">
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
          </tbody>
        </table>
      </div>
    {/* Year-over-Year Averages Table */}
    <h3 className="table-header">Year-over-Year Averages</h3>
    <div className="table-scroll-container">
      <table className="cr-table">
        <thead>
          <tr>
            <th>Year</th>
            {displayFields.map((field) =>
              field.key !== 'date' && <th key={field.key}>{field.label}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {allYears.map((year) => {
            const yearReports = allReports.filter(
              (r) => new Date(r.date).getFullYear() === year
            );
            const count = yearReports.length;
            const yearlyTotal = {};
            const yearlyAvg = {};

            // Calculate totals per field
            yearReports.forEach((r) => {
              Object.keys(r).forEach((key) => {
                if (typeof r[key] === 'number') {
                  yearlyTotal[key] = (yearlyTotal[key] || 0) + r[key];
                }
              });
            });

            // Convert totals to averages
            Object.keys(yearlyTotal).forEach((key) => {
              yearlyAvg[key] = (yearlyTotal[key] / count).toFixed(1);
            });

            return (
              <tr key={year}>
                <td>{year}</td>
                {displayFields.map((field) =>
                  field.key !== 'date' ? (
                    <td
                      key={field.key}
                      className={
                        typeof yearlyAvg[field.key] === 'string' &&
                        !isNaN(parseFloat(yearlyAvg[field.key])) &&
                        !isNaN(overallAverages[field.key])
                          ? parseFloat(yearlyAvg[field.key]) > overallAverages[field.key]
                            ? 'above-average'
                            : parseFloat(yearlyAvg[field.key]) < overallAverages[field.key]
                            ? 'below-average'
                            : ''
                          : ''
                      }
                    >
                      {field.key.toLowerCase().includes('don') ||
                      field.key.toLowerCase().includes('fund') ||
                      field.key.toLowerCase().includes('book') ||
                      field.key.toLowerCase().includes('food')
                        ? `$${parseFloat(yearlyAvg[field.key] || 0).toFixed(2)}`
                        : parseFloat(yearlyAvg[field.key] || 0).toFixed(1)}
                    </td>
                  ) : null
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    {/* Highest Values by Category Table */}
    <h3 className="table-header">Highest Single-Day Value</h3>
    <div className="table-scroll-container">
      <table className="cr-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Highest Value</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {displayFields
            .filter((field) => field.key !== 'date')
            .map((field) => {
              let maxValue = null;
              let maxDate = '';
              allReports.forEach((report) => {
                const value = report[field.key];
                if (typeof value === 'number') {
                  if (maxValue === null || value > maxValue) {
                    maxValue = value;
                    maxDate = report.date;
                  }
                }
              });

              return (
                <tr key={field.key}>
                  <td>{field.label}</td>
                  <td>
                    {field.key.toLowerCase().includes('don') ||
                    field.key.toLowerCase().includes('fund') ||
                    field.key.toLowerCase().includes('book') ||
                    field.key.toLowerCase().includes('food')
                      ? `$${(maxValue || 0).toFixed(2)}`
                      : maxValue !== null
                      ? maxValue
                      : ''}
                  </td>
                  <td>
                    {maxDate
                      ? new Date(maxDate).toLocaleDateString('en-US', {
                          timeZone: 'UTC',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : ''}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  </div>
);
};

export default CRDashboard;