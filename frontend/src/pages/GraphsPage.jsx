import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { API_BASE_URL } from '../config';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GraphsPage = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/reports`);
        const data = await res.json();

        const currentYear = new Date().getFullYear();
        const filtered = data
          .filter(entry => new Date(entry.date).getFullYear() === currentYear)
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setReportData(filtered);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const average = reportData.length > 0
    ? reportData.reduce((sum, entry) => sum + entry.largeGroupChurch, 0) / reportData.length
    : 0;

  const chartData = {
    labels: reportData.map(entry => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Large Group Attendance',
        data: reportData.map(entry => entry.largeGroupChurch),
        borderColor: '#164c88',
        backgroundColor: 'rgba(22,76,136,0.3)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Yearly Average',
        data: new Array(reportData.length).fill(average),
        borderColor: '#f59e0b', // Tailwind's yellow-500
        borderDash: [6, 6],
        pointRadius: 0,
        fill: false,
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
      title: { display: true, text: 'Large Group Attendance - Current Year' }
    },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Attendance Count' } }
    }
  };

  return (
    <div className="entry-page">
      <h2 style={{ textAlign: 'center' }}>📈 Graphs & Visuals</h2>
      <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#555', marginTop: '-0.5rem' }}>
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
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphsPage;
