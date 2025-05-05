
import React, { useEffect, useState } from 'react';

const fieldLabels = {
  largeGroupChurch: 'Large Group Church',
  children: 'Children',
  childrenWorkers: 'Children Workers',
  blueChips: 'Blue Chips',
  donations: 'Donations',
  salesFromBooks: 'Sales From Books',
  foodDonation: 'Food Donation',
  mealsServed: 'Meals Served',
  teens: 'Teens',
  mensLifeIssues: "Men's Life Issues",
  mensAddiction: "Men's Addiction",
  womensAddiction: "Women's Addiction",
  womensLifeIssues: "Women's Life Issues",
  newBeginnings: 'New Beginnings',
  baptisms: 'Baptisms',
  stepStudyGraduates: 'Step Study Graduates',
  comment: 'Comment'
};

const ReviewPage = () => {
  const [selectedDate, setSelectedDate] = useState('');
  // const [entries, setEntries] = useState([]);
  const [finalReport, setFinalReport] = useState({});
  const [status, setStatus] = useState({});

  useEffect(() => {
    if (!selectedDate) return;

    const fetchPendingData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/pending/${selectedDate}`);
        const data = await response.json();

        const grouped = {};
        const fieldStatus = {};

        data.forEach(entry => {
          grouped[entry.type] = entry.value;
          fieldStatus[entry.type] = entry.value !== undefined ? 'edited' : 'missing';
        });

        setFinalReport(grouped);
        setStatus(fieldStatus);
      } catch (err) {
        console.error('Error fetching pending data:', err);
        setFinalReport({});
        setStatus({});
      }
    };

    fetchPendingData();
  }, [selectedDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFinalReport(prev => ({ ...prev, [name]: value }));
    setStatus(prev => ({ ...prev, [name]: 'edited' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...finalReport, date: selectedDate })
      });

      alert('✅ Final report submitted!');
      setFinalReport({});
      setSelectedDate('');
      setStatus({});
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2>Ministry Lead Review/Submit</h2>
      <div style={{ backgroundColor: '#f0f8ff', padding: '1rem', borderRadius: '5px', marginBottom: '1rem' }}>
        <strong>Instructions:</strong>
        <ol style={{ paddingLeft: '1.2rem' }}>
          <li>Select a Date</li>
          <li>Review the numbers submitted and make any necessary changes or edits.</li>
          <li>Hit the green <strong>"Submit Final Report"</strong> button</li>
        </ol>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label><strong>Select Date:</strong></label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>

        {Object.keys(fieldLabels).map((key) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ flex: 1 }}>{fieldLabels[key]}:</label>
            <input
              type={key === 'comment' ? 'text' : 'number'}
              name={key}
              value={finalReport[key] || ''}
              onChange={handleChange}
              style={{ flex: 2, marginRight: '1rem' }}
            />
            <span style={{ flex: 1, color: status[key] === 'edited' ? 'green' : 'red' }}>
              {status[key] === 'edited' ? '✔ edited' : '⚠ Missing Data'}
            </span>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <button
            type="submit"
            style={{
              padding: '0.6rem 1.2rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            ✅ Submit Final Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewPage;
