// frontend/src/components/CRDashboard.jsx
import React, { useEffect, useState } from 'react';

const CRDashboard = ({ refreshFlag }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/reports');
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();
        setReports(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setLoading(false);
      }
    };
  
    fetchReports();
  }, [refreshFlag]); // ✅ re-run when flag changes

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <p className="text-center text-gray-600">Loading reports...</p>
      ) : (
        <table className="min-w-[1500px] bg-white border border-gray-200 shadow-sm rounded-lg">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Large Group</th>
              <th className="px-4 py-2">Children</th>
              <th className="px-4 py-2">Children Workers</th>
              <th className="px-4 py-2">Total Attendance</th>
              <th className="px-4 py-2">Blue Chips</th>
              <th className="px-4 py-2">Teens</th>
              <th className="px-4 py-2">Men's Life Issues</th>
              <th className="px-4 py-2">Men's Addiction</th>
              <th className="px-4 py-2">Women's Addiction</th>
              <th className="px-4 py-2">Women's Life Issues</th>
              <th className="px-4 py-2">New Beginnings</th>
              <th className="px-4 py-2">Baptisms</th>
              <th className="px-4 py-2">Meals</th>
              <th className="px-4 py-2">Donations</th>
              <th className="px-4 py-2">Book Sales</th>
              <th className="px-4 py-2">Food Donation</th>
              <th className="px-4 py-2">Approved</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => {
              const totalAttendance =
                (report.largeGroupChurch || 0) +
                (report.children || 0) +
                (report.childrenWorkers || 0);

              return (
                <tr key={report._id} className="border-t border-gray-200 text-sm text-center">
                  <td className="px-2 py-1">{new Date(report.date).toLocaleDateString()}</td>
                  <td className="px-2 py-1">{report.largeGroupChurch}</td>
                  <td className="px-2 py-1">{report.children}</td>
                  <td className="px-2 py-1">{report.childrenWorkers}</td>
                  <td className="px-2 py-1 font-bold">{totalAttendance}</td>
                  <td className="px-2 py-1">{report.blueChips}</td>
                  <td className="px-2 py-1">{report.teens}</td>
                  <td className="px-2 py-1">{report.mensLifeIssues}</td>
                  <td className="px-2 py-1">{report.mensAddiction}</td>
                  <td className="px-2 py-1">{report.womensAddiction}</td>
                  <td className="px-2 py-1">{report.womensLifeIssues}</td>
                  <td className="px-2 py-1">{report.newBeginnings}</td>
                  <td className="px-2 py-1">{report.baptisms}</td>
                  <td className="px-2 py-1">{report.mealsServed}</td>
                  <td className="px-2 py-1">${Number(report.donations).toFixed(2)}</td>
                  <td className="px-2 py-1">${Number(report.bookSales).toFixed(2)}</td>
                  <td className="px-2 py-1">${Number(report.foodDonation).toFixed(2)}</td>
                  <td className="px-2 py-1">{report.approved ? '✅' : '❌'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CRDashboard;