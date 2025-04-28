// frontend/src/pages/DynamicEntryPage.jsx

import React, { useState } from 'react';
import { API_BASE_URL } from '../config'; // Make sure this is correctly set up

const DynamicEntryPage = () => {
  // State for form values
  const [selectedOption, setSelectedOption] = useState('');
  const [formData, setFormData] = useState({});
  const [date, setDate] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(''); // Error state for user feedback

  // Define your field groups as before
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

  // Handle changes to each input field
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value === '' ? '' : Number(value) });
  };

  // Handle form submission with error and success handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');      // Clear previous errors on new submit
    setSuccess(false); // Clear success on new submit

    try {
      // Map selected fields to the entries array
      const entries = fieldGroups[selectedOption].map((key) => ({
        date,
        type: key,
        value: formData[key] || 0
      }));

      // Submit all entries (could be one or more) in parallel
      const responses = await Promise.all(
        entries.map(entry =>
          fetch(`${API_BASE_URL}/api/pending`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry)
          })
        )
      );

      // Check if any request failed due to duplicate (409)
      const duplicate = responses.find(res => res.status === 409);

      if (duplicate) {
        setError(
          "Someone has already submitted this section for the selected date. " +
          "Please check if you chose the right section and date, or contact the leader if you think this is a mistake."
        );
        setSuccess(false);
        return;
      }

      // Check for generic failure (network/server error)
      if (responses.every(res => res.ok)) {
        setSuccess(true);
        setError('');
        setFormData({});
        setSelectedOption('');
        setDate('');
        setTimeout(() => setSuccess(false), 3000); // Optional auto-hide success
      } else {
        // Gather errors from all responses
        const errMsgs = await Promise.all(responses.map(async res => {
          if (!res.ok) {
            try {
              const data = await res.json();
              return data.error || res.statusText;
            } catch {
              return res.statusText;
            }
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

  // Only enable submit if date, option, and all fields have a value
  const isFormReady =
    date &&
    selectedOption &&
    fieldGroups[selectedOption].every(field => formData[field] !== undefined && formData[field] !== '');

  return (
    <div className="entry-page" style={{ display: 'flex', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
        <h2 style={{ textAlign: 'center' }}>Submit Celebrate Recovery Numbers</h2>

        {/* Error display */}
        {error && (
          <div style={{
            color: 'red',
            background: '#ffeaea',
            border: '1px solid #ffbbbb',
            borderRadius: '5px',
            padding: '0.75em',
            marginBottom: '1.25em',
            textAlign: 'center'
          }}>
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

        {/* Render fields for the selected section */}
        {selectedOption && fieldGroups[selectedOption].map((field) => (
          <div key={field} style={{ marginBottom: '0.75rem' }}>
            <label>{formatLabel(field)}:</label><br />
            <input
              type="number"
              value={formData[field] || ''}
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

// Helper function to format field labels
function formatLabel(field) {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .replace('Church', 'Group');
}

export default DynamicEntryPage;