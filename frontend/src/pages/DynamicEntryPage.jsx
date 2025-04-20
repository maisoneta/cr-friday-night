
import React, { useState } from 'react';

const DynamicEntryPage = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [formData, setFormData] = useState({});
  const [date, setDate] = useState('');
  const [success, setSuccess] = useState(false);

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

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value === '' ? '' : Number(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const entries = fieldGroups[selectedOption].map((key) => ({
        date,
        type: key,
        value: formData[key] || 0
      }));

      const responses = await Promise.all(
        entries.map(entry =>
          fetch('/api/pending', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry)
          })
        )
      );

      if (responses.every(res => res.ok)) {
        setSuccess(true);
        setFormData({});
        setSelectedOption('');
        setDate('');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        console.error('One or more entries failed.');
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const isFormReady =
    date &&
    selectedOption &&
    fieldGroups[selectedOption].every(field => formData[field] !== undefined && formData[field] !== '');

  return (
    <div className="entry-page" style={{ display: 'flex', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
        <h2 style={{ textAlign: 'center' }}>Submit Celebrate Recovery Numbers</h2>

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

        {success && (
          <div style={{ marginTop: '1.25rem', color: 'green', textAlign: 'center', fontWeight: '500' }}>
            ✅ Your numbers have been submitted!
          </div>
        )}
      </form>
    </div>
  );
};

const formatLabel = (field) => {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .replace('Church', 'Group');
};

export default DynamicEntryPage;
