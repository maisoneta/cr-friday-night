// File: frontend/src/pages/GraphsPage.jsx

/*
  GraphsPage shows two key visualizations:
  - Line chart of weekly large group attendance
  - Bar chart comparing current and previous year averages

  Data is pulled from the backend and filtered by year.
  Chart.js and chartjs-plugin-datalabels are used for styling and display.
*/
import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { get } from '../api/client';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);
ChartJS.register(ChartDataLabels);

// Fetch report data and calculate yearly averages
const GraphsPage = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearlyAverages, setYearlyAverages] = useState({});

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { ok, data } = await get('/api/reports');
        if (!ok) throw new Error('Failed to load reports');
        const reportList = Array.isArray(data) ? data : [];

        const currentYear = new Date().getFullYear();
        const filtered = reportList
          .filter(entry => new Date(entry.date).getFullYear() === currentYear)
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setReportData(filtered);

        const previousYear = currentYear - 1;
        const currentData = reportList.filter(entry => new Date(entry.date).getFullYear() === currentYear);
        const prevData = reportList.filter(entry => new Date(entry.date).getFullYear() === previousYear);

        const calcAvg = (arr, key) => arr.length ? arr.reduce((sum, e) => sum + (e[key] || 0), 0) / arr.length : 0;

        const categories = ['totalAttendance', 'totalFunds', 'mealsServed', 'blueChips', 'totalSmallGroup'];
        const averages = {
          current: categories.map(key => calcAvg(currentData, key)),
          previous: categories.map(key => calcAvg(prevData, key)),
          labels: ['Total Attendance', 'Total Funds', 'Meals Served', 'Blue Chips', 'Small Group']
        };

        setYearlyAverages(averages);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Calculate average large group attendance for current year
  const average = reportData.length > 0
    ? reportData.reduce((sum, entry) => sum + entry.largeGroupChurch, 0) / reportData.length
    : 0;

  // Configuration for the line chart
  const chartData = {
    labels: reportData.map(entry => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Large Group Attendance',
        data: reportData.map(entry => entry.largeGroupChurch),
        borderColor: '#008B8B',
        backgroundColor: 'rgba(0, 139, 139, 0.3)',
        fill: true,
        tension: 0.3,
        datalabels: {
          display: true,
          anchor: 'end',
          align: 'top',
          offset: -6,
          font: {
            weight: 'bold',
            size: 14
          },
          color: '#000'
        }
      },
      {
        // Remove the label from the dashed "Yearly Average" line
        // label: 'Yearly Average',
        data: new Array(reportData.length).fill(average),
        borderColor: '#E07C3C', // CR orange accent
        borderDash: [6, 6],
        pointRadius: 0,
        fill: false,
        datalabels: {
          display: false
        }
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    layout: {
      padding: 20
    },
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Large Group (Chapel) Attendance - Current Year' }
    },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Attendance Count' } }
    }
  };

  // Configuration for the bar chart comparing yearly averages
  const barChartData = {
    labels: yearlyAverages.labels || [],
    datasets: [
      {
        label: `${new Date().getFullYear()} Average`,
        backgroundColor: '#008B8B',
        data: yearlyAverages.current || []
      },
      {
        label: `${new Date().getFullYear() - 1} Average`,
        backgroundColor: '#E07C3C',
        data: yearlyAverages.previous || []
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Yearly Averages Comparison' },
      datalabels: {
        anchor: 'end',
        align: 'start',
        clamp: true,
        offset: -8,
        formatter: value => Math.round(value),
        font: {
          weight: 'bold',
          size: 15
        },
        color: '#000'
      }
    },
    scales: {
      x: { title: { display: true, text: 'Category' } },
      y: { title: { display: true, text: 'Average Value' } }
    }
  };

  // Render both charts inside styled containers
  return (
    <div className="entry-page">
      <h2 style={{ textAlign: 'center' }}>📈 Graphs & Visuals</h2>
      <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#2D3748', marginTop: '-0.5rem' }}>
        Tip: If viewing on phone rotate for best viewing.
      </p>
      {loading ? (
        <p>Loading chart...</p>
      ) : (
        <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '100%',
              maxWidth: '1100px',
              minHeight: '300px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '1rem',
              boxSizing: 'border-box',
              overflowX: 'auto',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Line data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />
          </div>
          <div
            style={{
              width: '100%',
              maxWidth: '1100px',
              minHeight: '300px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '1rem',
              boxSizing: 'border-box',
              overflowX: 'auto',
              margin: '2rem auto 0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Bar data={barChartData} options={barChartOptions} plugins={[ChartDataLabels]} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphsPage;
