// File: frontend/src/pages/ReviewPage.jsx

/*
  ReviewPage allows the Ministry Lead to:
  - Select a date to load pending report data
  - Review and optionally edit each field's value
  - Submit the finalized report to the backend
  Displays visual indicators for missing or edited fields.
*/

import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import { fieldGroups, fieldLabels } from '../fieldConfig';

const ReviewPage = () => {
  // Selected date to review
  const [selectedDate, setSelectedDate] = useState('');

  // Final report object and field statuses
  const [finalReport, setFinalReport] = useState({});
  const [status, setStatus] = useState({});

  // Error, info, or success message display
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // Section comments from submitters (group name -> comment)
  const [sectionComments, setSectionComments] = useState({});

  // Fetch pending report data for selected date
  useEffect(() => {
    if (!selectedDate) return;

    const fetchPendingData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/pending/${selectedDate}`);
        const data = await response.json();

        // 404 = no pending entries for this date
        if (response.status === 404) {
          setFinalReport({});
          setStatus({});
          setSectionComments({});
          setInfoMessage('No pending data for this date yet. Have team members submit entries via "Add Group Data" first.');
          setErrorMessage('');
          return;
        }

        if (!response.ok) {
          setErrorMessage(data.message || 'Failed to load pending data.');
          setInfoMessage('');
          return;
        }

        const grouped = {};
        const fieldStatus = {};
        const commentsBySection = {};

        (Array.isArray(data) ? data : []).forEach(entry => {
          grouped[entry.type] = entry.value;
          fieldStatus[entry.type] = entry.value !== undefined ? 'edited' : 'missing';
          // Derive group from field if not in payload (legacy data)
          const group = entry.group || Object.entries(fieldGroups).find(([, fields]) => fields.includes(entry.type))?.[0] || '';
          if (group && entry.comment) {
            commentsBySection[group] = entry.comment;
          }
        });

        setFinalReport(grouped);
        setStatus(fieldStatus);
        setSectionComments(commentsBySection);
        setErrorMessage('');
        setInfoMessage('');
      } catch (err) {
        console.error('Error fetching pending data:', err);
        setFinalReport({});
        setStatus({});
        setSectionComments({});
        setErrorMessage('Failed to load pending data. Is the backend running?');
        setInfoMessage('');
      }
    };

    fetchPendingData();
  }, [selectedDate]);

  // Update final report values and mark fields as edited
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFinalReport(prev => ({ ...prev, [name]: value }));
    setStatus(prev => ({ ...prev, [name]: 'edited' }));
  };

  // Submit finalized report to backend with error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...finalReport, date: selectedDate })
      });

      if (response.status === 409) {
        const data = await response.json();
        setErrorMessage(data.message || 'Duplicate submission not allowed.');
        setInfoMessage('');
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.message || 'An unexpected error occurred.');
        setInfoMessage('');
        return;
      }

      setErrorMessage('✅ Final report submitted!');
      setInfoMessage('');
      setFinalReport({});
      setSectionComments({});
      setSelectedDate('');
      setStatus({});
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage('An unexpected error occurred.');
      setInfoMessage('');
    }
  };

  // Render instruction box, date picker, editable inputs, and submit button
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

      {errorMessage && (
        <div style={{ backgroundColor: '#ffe6e6', color: '#cc0000', padding: '0.75rem', marginBottom: '1rem', borderRadius: '5px' }}>
          {errorMessage}
        </div>
      )}
      {infoMessage && (
        <div style={{ backgroundColor: '#e6f3ff', color: '#0066cc', padding: '0.75rem', marginBottom: '1rem', borderRadius: '5px' }}>
          {infoMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label><strong>Select Date:</strong></label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            onClick={e => e.target.showPicker?.()}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>

        {Object.entries(fieldGroups).map(([sectionName, fieldKeys]) => (
          <div key={sectionName} style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--cr-navy)', fontSize: '1.1rem' }}>{sectionName}</h3>
            {sectionComments[sectionName] && (
              <div style={{ marginBottom: '0.75rem', padding: '0.5rem', backgroundColor: 'rgba(0, 139, 139, 0.08)', borderRadius: '6px', fontSize: '0.95rem', color: 'var(--cr-navy)' }}>
                <strong>Comments from submitter:</strong> {sectionComments[sectionName]}
              </div>
            )}
            {fieldKeys.map((key) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ flex: 1 }}>{fieldLabels[key]}:</label>
                <input
                  type="number"
                  name={key}
                  value={finalReport[key] || ''}
                  onChange={handleChange}
                  style={{ flex: 2, marginRight: '1rem', textAlign: 'center' }}
                />
                <span style={{ flex: 1, color: status[key] === 'edited' ? 'green' : 'red', fontSize: '0.9rem' }}>
                  {status[key] === 'edited' ? '✔ edited' : '⚠ Missing Data'}
                </span>
              </div>
            ))}
          </div>
        ))}

        <div style={{ marginBottom: '0.5rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--cr-navy)', fontSize: '1.1rem' }}>Ministry Lead Notes</h3>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ flex: 1 }}>{fieldLabels.comment}:</label>
            <input
              type="text"
              name="comment"
              value={finalReport.comment || ''}
              onChange={handleChange}
              placeholder="Overall notes or comments for the report"
              style={{ flex: 2, marginRight: '1rem', textAlign: 'left' }}
            />
            <span style={{ flex: 1, color: 'gray', fontSize: '0.9rem' }}>Optional</span>
          </div>
        </div>

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
