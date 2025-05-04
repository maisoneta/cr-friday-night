// frontend/src/pages/DynamicEntryPage.jsx

import React, { useState } from 'react';
import { API_BASE_URL } from '../config'; // Ensure this points to your backend API

const DynamicEntryPage = () => {
  // State hooks
  const [selectedOption, setSelectedOption] = useState('');
  const [formData, setFormData] = useState({});
  const [date, setDate] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Define grouped fields for different entry types
  const fieldGroups = {
    'Large Gp/Children/Workers': ['largeGroupChurch', 'children', 'childrenWorkers'],
    'Donations, Sales from Books, Food Donation': ['donations', 'salesFromBooks', 'foodDonation'],
    'Teens': ['teens'],
    "Men's Life Issues": ['mensLifeIssues'],
    "Men's Addiction": ['mensAddiction'],
    "Women's Addiction": ['womensAddiction'],
    "Women's Life Issues": ['womensLifeIssues'],
    'New Beginnings': ['newBeginnings'],
    'Baptisms': ['baptisms'],
    'Blue Chips': ['blueChips'],
    'Meals Served': ['mealsServed'],
    'Step Study Graduates': ['stepStudyGraduates']
  };

  // Handle individual input change
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value === '' ? '' : Number(value) });
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      // Convert selected section into entry objects
      const entries = fieldGroups[selectedOption].map((key) => ({
        date,
        type: key,
        value: formData[key] || 0
      }));

      // Send all entries in parallel
      const responses = await Promise.all(
        entries.map(entry =>
          fetch(`${API_BASE_URL}/api/pending`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry)
          })
        )
      );

      // Handle duplicate detection
      const duplicateResponse = responses.find(res => res.status === 409);
      if (duplicateResponse) {
        try {
          const errorData = await duplicateResponse.json();
          setError(errorData.message || "Duplicate entry detected.");
        } catch {
          setError("Duplicate entry detected, but failed to load details.");
        }
        setTimeout(() => {
          const errorBox = document.getElementById('entry-error-box');
          if (errorBox) errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        setSuccess(false);
        return;
      }

      // If all responses OK, clear form and show success
      if (responses.every(res => res.ok)) {
        setSuccess(true);
        setError('');
        setFormData({});
        setSelectedOption('');
        setDate('');
        setTimeout(() => setSuccess(false), 3000); // Optional auto-dismiss
      } else {
        // Accumulate error messages from failed responses
        const errMsgs = await Promise.all(responses.map(async res => {
          if (!res.ok) {
            let message = `Error ${res.status}`;
            try {
              const contentType = res.headers.get('content-type');
              if (contentType && contentType.includes('application/json')) {
                const data = await res.json();
                message = data.message || data.error || message;
              } else {
                const text = await res.text();
                message = text || message;
              }
            } catch (err) {
              // fall back to default message
            }
            return message;
          }
          return null;
        }));
        setError('Submission error: ' + errMsgs.filter(Boolean).join('; '));
        setSuccess(false);
      }
    } catch (error) {
      setError('Submission error: ' + error.message);
      setSuccess(false);
    }
  };

  // Form readiness check: requires date, section, and filled values
  const isFormReady =
    date &&
    selectedOption &&
    fieldGroups[selectedOption].every(field => formData.hasOwnProperty(field));

  return (
    <div className="entry-page" style={{ display: 'flex', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
        <h2 style={{ textAlign: 'center' }}>Log Your Group Data</h2>
        <ul style={{ marginBottom: '1rem', paddingLeft: '1.25rem' }}>
          <li>1. Select the Date</li>
          <li>2. Pick the section you are reporting numbers</li>
          <li>3. Hit the Submit button</li>
        </ul>

        {/* Error box with scroll-into-view on duplicate */}
        {error && (
          <div
            id="entry-error-box"
            style={{
              color: 'red',
              background: '#ffeaea',
              border: '1px solid #ffbbbb',
              borderRadius: '5px',
              padding: '0.75em',
              marginBottom: '1.25em',
              textAlign: 'center'
            }}
          >
            {error}
          </div>
        )}

        {/* Date input */}
        <div style={{ marginBottom: '1rem' }}>
          <label><strong>Date:</strong></label><br />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>

        {/* Section selector */}
        <div style={{ marginBottom: '1rem' }}>
          <label><strong>Section:</strong></label><br />
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          >
            <option value="">-- Select Section --</option>
            {Object.keys(fieldGroups).map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        {/* Dynamic fields based on selected section */}
        {selectedOption && fieldGroups[selectedOption].map((field) => (
          <div key={field} style={{ marginBottom: '0.75rem' }}>
            <label>{formatLabel(field)}:</label><br />
            <input
              type="number"
              value={formData[field] !== undefined ? formData[field] : ''}
              onChange={(e) => handleChange(field, e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </div>
        ))}

        {/* Submit button */}
        <button
          type="submit"
          disabled={!isFormReady}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: isFormReady ? '#007bff' : '#ccc',
            color: 'white',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '4px',
            cursor: isFormReady ? 'pointer' : 'not-allowed',
            marginTop: '1rem'
          }}
        >
          Submit
        </button>

        {/* Success message */}
        {success && (
          <div style={{ marginTop: '1.25rem', color: 'green', textAlign: 'center', fontWeight: '500' }}>
            ✅ Your numbers have been submitted!
          </div>
        )}
      </form>
    </div>
  );
};

// Helper to make field labels human-readable
function formatLabel(field) {
  return field
    .replace(/([A-Z])/g, ' $1')        // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first character
    .replace('Church', 'Group');       // Optional wording tweak
}

export default DynamicEntryPage;