// File: frontend/src/pages/ReviewPage.jsx

/*
  ReviewPage allows the Ministry Lead to:
  - Select a date to load pending report data
  - Review and optionally edit each field's value
  - Submit the finalized report to the backend
  Displays visual indicators for missing or edited fields.
*/

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { get, post, getErrorMessage } from '../api/client';
import { fieldGroups, fieldLabels, reportFormFieldKeys } from '../fieldConfig';

// Format date for display (e.g., "10 Feb 2026")
const formatDateReadable = (isoDate) => {
  if (!isoDate) return '';
  const d = new Date(isoDate + 'T12:00:00');
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

const ReviewPage = () => {
  // Selected date to review
  const [selectedDate, setSelectedDate] = useState('');

  // Final report object and field statuses
  const [finalReport, setFinalReport] = useState({});
  const [status, setStatus] = useState({});

  // Error, info, or success message display
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // Success state: show confirmation view instead of form
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedDate, setSubmittedDate] = useState('');
  const [submittedReport, setSubmittedReport] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Section comments from submitters (group name -> comment)
  const [sectionComments, setSectionComments] = useState({});

  // Fetch pending report data for selected date
  useEffect(() => {
    if (!selectedDate) return;

    const fetchPendingData = async () => {
      try {
        const { ok, status, data } = await get(`/api/pending/${selectedDate}`);

        // 404 = no pending entries for this date
        if (status === 404) {
          setFinalReport({});
          setStatus({});
          setSectionComments({});
          setInfoMessage('No pending data for this date yet. Have team members submit entries via "Add Group Data" first.');
          setErrorMessage('');
          return;
        }

        if (!ok) {
          setErrorMessage(getErrorMessage({ status, data }, 'Failed to load pending data.'));
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
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const { ok, status, data } = await post('/api/reports', { ...finalReport, date: selectedDate });

      if (status === 409) {
        setErrorMessage(getErrorMessage({ status, data }, 'Duplicate submission not allowed.'));
        setInfoMessage('');
        setIsSubmitting(false);
        return;
      }

      if (!ok) {
        setErrorMessage(getErrorMessage({ status, data }, 'An unexpected error occurred.'));
        setInfoMessage('');
        setIsSubmitting(false);
        return;
      }

      setSubmittedDate(selectedDate);
      setSubmittedReport({ ...finalReport });
      setSubmitSuccess(true);
      setErrorMessage('');
      setInfoMessage('');
      setFinalReport({});
      setSectionComments({});
      setSelectedDate('');
      setStatus({});
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage('An unexpected error occurred.');
      setInfoMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success confirmation view (similar to ThankYouPage for Add Group Data)
  if (submitSuccess) {
    return (
      <div className="entry-page">
        <div style={{
          width: '100%', maxWidth: '500px', margin: '0 auto',
          background: '#FFFFFF', padding: '2rem', borderRadius: '18px',
          boxShadow: '0 4px 20px rgba(0, 139, 139, 0.1)', border: '1px solid var(--cr-border)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
          <h2 style={{ color: 'var(--cr-navy)', margin: '0 0 0.5rem 0' }}>Report Submitted!</h2>
          <p style={{ color: '#666', margin: '0 0 1rem 0' }}>
            You've successfully submitted the final report for:
          </p>
          <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--cr-teal)', margin: '0 0 1.5rem 0' }}>
            {formatDateReadable(submittedDate)}
          </p>

          <div style={{ textAlign: 'left', marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8fbfb', borderRadius: '12px', border: '1px solid var(--cr-border)' }}>
            <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Submitted data summary</p>
            {(reportFormFieldKeys || Object.keys(submittedReport))
              .filter(key => key !== 'comment' && submittedReport[key] !== undefined && submittedReport[key] !== '' && submittedReport[key] !== null)
              .map(key => (
                <div key={key} style={{ marginBottom: '0.35rem', fontSize: '0.95rem' }}>
                  <strong style={{ color: 'var(--cr-navy)' }}>{fieldLabels[key] ?? key}:</strong> {submittedReport[key]}
                </div>
              ))}
            {submittedReport.comment && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.95rem', fontStyle: 'italic', color: '#555' }}>
                <strong>Note:</strong> {submittedReport.comment}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxWidth: '280px', margin: '0 auto' }}>
            <button
              type="button"
              onClick={() => { setSubmitSuccess(false); setSubmittedDate(''); setSubmittedReport({}); }}
              style={{
                width: '100%', padding: '0.9rem 1.25rem', fontSize: '1rem', fontWeight: 600,
                color: 'var(--cr-text-light)', background: 'linear-gradient(135deg, var(--cr-teal) 0%, var(--cr-teal-dark) 100%)',
                border: 'none', borderRadius: '12px', cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 139, 139, 0.25)'
              }}
            >
              Review Another Report
            </button>
            <Link to="/">
              <button style={{
                width: '100%', padding: '0.9rem 1.25rem', fontSize: '1rem', fontWeight: 600,
                color: 'var(--cr-navy)', background: '#fff', border: '2px solid var(--cr-teal)',
                borderRadius: '12px', cursor: 'pointer'
              }}>
                Return to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                  value={finalReport[key] ?? ''}
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
            disabled={isSubmitting}
            style={{
              padding: '0.6rem 1.2rem',
              backgroundColor: isSubmitting ? '#9e9e9e' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'Submitting…' : '✅ Submit Final Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewPage;
