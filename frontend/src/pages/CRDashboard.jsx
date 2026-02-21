// File: frontend/src/pages/CRDashboard.jsx

/*
  CRDashboard displays Celebrate Recovery report data including:
  - Last 12 entries with conditional highlights
  - YTD totals and averages by selected year
  - Year-over-year averages with highlighting
  - Highest single-day values by category

  Pulls data from the backend and auto-calculates derived fields.
*/

import React, { useEffect, useState, useMemo } from 'react';
import '../components/CRDashboard.css'; // Import styles specific to the CR dashboard
import { get } from '../api/client';

// Configuration for the table fields (what to show and in what order)
const DISPLAY_FIELDS = [
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

// CRDashboard displays Celebrate Recovery attendance and contribution stats
const CRDashboard = () => {
  // Report data
  const [reports, setReports] = useState([]);
  const [allReports, setAllReports] = useState([]);

  // Year selection
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
  const [allYears, setAllYears] = useState([]);

  // Aggregated stats
  const [totals, setTotals] = useState({});
  const [averages, setAverages] = useState({});
  const [loadError, setLoadError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch report data and compute YTD totals/averages
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadError('');
      setIsLoading(true);
      try {
        const { ok, data } = await get('/api/reports');
        if (!ok) throw new Error('Failed to load reports');
        const reportList = Array.isArray(data) ? data : [];

        // Sort reports by date (newest first) and limit to last 12
        const sorted = [...reportList].sort((a, b) => new Date(b.date) - new Date(a.date));
        setAllReports(reportList); // full dataset for other calculations
        setReports(sorted.slice(0, 12)); // last 12 entries only

        // Extract and sort all unique years
        const years = Array.from(new Set(reportList.map(r => new Date(r.date).getFullYear()))).sort((a, b) => b - a);
        setAllYears(years);

        // Filter data by selected year
        const yearFiltered = reportList.filter(r => new Date(r.date).getFullYear() === displayYear);
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
        setLoadError('');
      } catch (err) {
        console.error('Error fetching reports:', err);
        setLoadError('Could not load dashboard data. Is the backend running?');
        setReports([]);
        setAllReports([]);
        setAllYears([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [displayYear]); // Re-run when year changes

  // Format display value based on key type (e.g., date or currency)
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

  // Compute overall averages used for comparison highlights (memoized)
  const overallAverages = useMemo(() => {
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
    const result = {};
    Object.keys(allFieldSums).forEach((key) => {
      result[key] = allFieldSums[key] / allFieldCounts[key];
    });
    return result;
  }, [allReports]);

  // Determine global and recent highest values per field (memoized)
  const { globalHighs, recentHighs } = useMemo(() => {
    const globalHighs = {};
    const recentHighs = {};
    const safeMax = (arr) => {
      const vals = arr.filter((v) => typeof v === 'number');
      return vals.length > 0 ? Math.max(...vals) : -Infinity;
    };
    DISPLAY_FIELDS.forEach(({ key }) => {
      if (key === 'date') return;
      globalHighs[key] = safeMax(allReports.map((r) => r[key]));
      recentHighs[key] = safeMax(reports.map((r) => r[key]));
    });
    return { globalHighs, recentHighs };
  }, [allReports, reports]);

  // Year-over-year stats per year (memoized)
  const yearlyStats = useMemo(() => {
    const result = {};
    allYears.forEach((year) => {
      const yearReports = allReports.filter((r) => new Date(r.date).getFullYear() === year);
      const count = yearReports.length;
      const yearlyTotal = {};
      const yearlyAvg = {};
      if (count > 0) {
        yearReports.forEach((r) => {
          Object.keys(r).forEach((key) => {
            if (typeof r[key] === 'number') {
              yearlyTotal[key] = (yearlyTotal[key] || 0) + r[key];
            }
          });
        });
        Object.keys(yearlyTotal).forEach((key) => {
          yearlyAvg[key] = (yearlyTotal[key] / count).toFixed(1);
        });
      }
      result[year] = { yearlyTotal, yearlyAvg };
    });
    return result;
  }, [allReports, allYears]);

  // Highest single-day values per field (memoized)
  const highestValues = useMemo(() => {
    return DISPLAY_FIELDS.filter((f) => f.key !== 'date').map((field) => {
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
      return { field, maxValue, maxDate };
    });
  }, [allReports]);

  // Render dashboard layout with 4 summary tables and legend
  return (
    <div className="cr-dashboard">
      <h2 className="dashboard-title">Celebrate Recovery Dashboard</h2>

      {isLoading && <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>}
      {loadError && (
        <div style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>
          {loadError}
        </div>
      )}

      {!isLoading && (
        <>
      {/* Visual Legend for Value Highlights */}
      <div className="legend">
        <span><span className="legend-box legend-green" /> Above Average</span>
        <span><span className="legend-box legend-yellow" /> Below Average</span>
        <span><span className="legend-box recent-highest" /> Recent Highest Value</span>
      </div>

      {/* Last 12 Entries Table */}
      <h3 className="table-header">Last 12 Entries</h3>
      <div className="table-scroll-container">
        <table className="cr-table">
          <thead>
            <tr>
              {DISPLAY_FIELDS.map((field) => (
                <th key={field.key}>{field.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.map((report, rowIndex) => (
              <tr key={rowIndex}>
                {DISPLAY_FIELDS.map((field) => {
                  const rawValue = report[field.key];
                  const avg = parseFloat(averages[field.key]);
                  let className = '';

                  // Highlight above/below average
                  if (typeof rawValue === 'number' && !isNaN(avg)) {
                    if (rawValue > avg) className = 'above-average';
                    else if (rawValue < avg) className = 'below-average';
                  }

                  // Highlight recent highest value
                  if (
                    typeof rawValue === 'number' &&
                    rawValue === globalHighs[field.key] &&
                    rawValue === recentHighs[field.key]
                  ) {
                    className += ' recent-highest';
                  }

                  return (
                    <td key={field.key} className={className.trim()}>
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
              {DISPLAY_FIELDS.map((field) =>
                field.key !== 'date' && (
                  <th key={field.key}>{field.label}</th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Average</td>
              {DISPLAY_FIELDS.map((field) =>
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
              {DISPLAY_FIELDS.map((field) =>
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
            {DISPLAY_FIELDS.map((field) =>
              field.key !== 'date' && <th key={field.key}>{field.label}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {allYears.map((year) => {
            const { yearlyAvg } = yearlyStats[year] || { yearlyAvg: {} };
            return (
              <tr key={year}>
                <td>{year}</td>
                {DISPLAY_FIELDS.map((field) =>
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
          {highestValues.map(({ field, maxValue, maxDate }) => (
            <tr key={field.key}>
              <td>{field.label === 'LgGp' ? 'Large Group' : field.label}</td>
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
          ))}
        </tbody>
      </table>
    </div>
        </>
      )}
  </div>
);
};

export default CRDashboard;