/*
  DynamicEntryPage allows a user to:
  - Select a field or group of fields from a dropdown
  - Enter values dynamically based on that selection
  - Submit data with a date to the /api/pending route
*/

import React, { useState } from 'react';
import '../App.css';
import { API_BASE_URL } from '../config';

const DynamicEntryPage = () => {
  // Form state
  const [selectedOption, setSelectedOption] = useState('');
  const [formData, setFormData] = useState({});
  const [date, setDate] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Define field groupings
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

  // Handle value changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!date || !selectedOption) {
      setError('Date and a field selection are required.');
      return;
    }

    const fields = fieldGroups[selectedOption] || [];

    try {
      for (const field of fields) {
        const payload = {
          date,
          type: field,
          value: Number(formData[field] || 0),
        };

        const response = await fetch(`${API_BASE_URL}/api/pending`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Failed to submit ${field}`);
        }
      }

      setSuccess(true);
      setFormData({});
      setSelectedOption('');
      setDate('');
    } catch (err) {
      setError('Submission failed.');
    }
  };

  // Render inputs based on selection
  const selectedFields = fieldGroups[selectedOption] || [];

  return (
    <div className="entry-page">
      <h2>Add Group Data</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date:</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Choose Section:</label>
          <select value={selectedOption} onChange={e => setSelectedOption(e.target.value)} required>
            <option value="">-- Select --</option>
            {Object.keys(fieldGroups).map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        {selectedFields.map(field => (
          <div className="form-group" key={field}>
            <label>{field}:</label>
            <input
              type="number"
              value={formData[field] || ''}
              onChange={e => handleInputChange(field, e.target.value)}
              required
            />
          </div>
        ))}

        <button type="submit">Submit</button>
      </form>

      {success && <p style={{ color: 'green' }}>Submitted successfully.</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default DynamicEntryPage;