/*
  DynamicEntryPage allows a user to:
  - Select a field or group of fields from a dropdown
  - Enter values dynamically based on that selection
  - Submit data with a date to the /api/pending route
*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { fieldGroups } from '../fieldConfig';

const DynamicEntryPage = () => {
  const navigate = useNavigate();

  // Form state
  const [selectedOption, setSelectedOption] = useState('');
  const [formData, setFormData] = useState({});
  const [sectionComment, setSectionComment] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [hasExistingData, setHasExistingData] = useState(false);

  // When date + section are selected, fetch existing data for that section and pre-populate
  useEffect(() => {
    if (!date || !selectedOption) {
      setHasExistingData(false);
      return;
    }

    const fetchExisting = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/pending/${date}`);
        if (res.status === 404) {
          setHasExistingData(false);
          setFormData({});
          setSectionComment('');
          return;
        }
        if (!res.ok) return;

        const data = await res.json();
        const fields = fieldGroups[selectedOption] || [];
        const sectionEntries = (Array.isArray(data) ? data : []).filter(e => fields.includes(e.type));

        if (sectionEntries.length > 0) {
          const prefill = {};
          let comment = '';
          sectionEntries.forEach(entry => {
            prefill[entry.type] = entry.value;
            if (entry.comment) comment = entry.comment;
          });
          setFormData(prefill);
          setSectionComment(comment);
          setHasExistingData(true);
        } else {
          setFormData({});
          setSectionComment('');
          setHasExistingData(false);
        }
      } catch (err) {
        setHasExistingData(false);
      }
    };

    fetchExisting();
  }, [date, selectedOption]);

  // Handle value changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Reset when changing section (useEffect will re-fetch for new section)
  const handleSectionChange = (e) => {
    setSelectedOption(e.target.value);
    setFormData({});
    setSectionComment('');
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!date || !selectedOption) {
      setError('Date and a field selection are required.');
      return;
    }

    const fields = fieldGroups[selectedOption] || [];
    const comment = (sectionComment || '').trim();
    const group = selectedOption;

    try {
      for (const field of fields) {
        const payload = {
          date,
          type: field,
          value: Number(formData[field] || 0),
          comment,
          group,
          replace: hasExistingData,
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

      // Capture data before clearing, then navigate to Thank You page
      const submittedDate = date;
      const submittedFields = { ...formData };
      if (comment) submittedFields['Section comment'] = comment;

      setFormData({});
      setSectionComment('');
      setSelectedOption('');
      setDate('');
      setHasExistingData(false);

      navigate('/thank-you', { state: { date: submittedDate, fields: submittedFields } });
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
          <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              onClick={e => e.target.showPicker?.()}
              required
            />
        </div>

        <div className="form-group">
          <label>Choose Section:</label>
          <select value={selectedOption} onChange={handleSectionChange} required>
            <option value="">-- Select --</option>
            {Object.keys(fieldGroups).map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        {hasExistingData && (
          <div style={{
            backgroundColor: '#fff3cd',
            color: '#856404',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '1px solid #ffc107'
          }}>
            <strong>⚠️ This section already has data for this date.</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>
              The fields below show the current values. Submitting will replace them.
              Please review and only submit if you intend to update.
            </p>
          </div>
        )}

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

        <div className="form-group">
          <label>Comments for this section (optional):</label>
          <textarea
            value={sectionComment}
            onChange={e => setSectionComment(e.target.value)}
            placeholder="e.g., Notable events, issues, or notes from the night..."
            rows={3}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '10px', border: '1.5px solid var(--cr-teal)', resize: 'vertical' }}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default DynamicEntryPage;