// File: frontend/src/pages/CRForm.jsx

/*
  CRForm is the main input form for entering Celebrate Recovery Friday night data.
  - Checks for duplicate submissions by date
  - Requires at least one non-zero input before submitting
  - Sends data to parent handler via onSubmit
*/

// ✅ Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { get, post, getErrorMessage } from '../api/client';
import { reportFormFieldKeys, fieldLabels, getReportFormInitialState } from '../fieldConfig';

// ✅ CRForm handles input from the user for a new Celebrate Recovery report
const CRForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState(getReportFormInitialState());
  const [existingDates, setExistingDates] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [isLoadingDates, setIsLoadingDates] = useState(true);

  // Load existing report dates to prevent duplicate submissions
  useEffect(() => {
    setLoadError('');
    setIsLoadingDates(true);
    get('/api/reports')
      .then(({ ok, data }) => {
        if (!ok) {
          setLoadError('Unable to load existing reports. Submitting may fail if the date already exists.');
          return;
        }
        const dateMap = {};
        (data || []).forEach(item => {
          if (item.date) {
            const dateKey = new Date(item.date).toISOString().split('T')[0];
            dateMap[dateKey] = true;
          }
        });
        setExistingDates(dateMap);
        setLoadError('');
      })
      .catch(error => {
        console.error('Error fetching existing reports:', error);
        setLoadError('Could not connect to the server. Is the backend running?');
      })
      .finally(() => setIsLoadingDates(false));
  }, []);

  // Update form data as user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate and submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dateKey = new Date(formData.date).toISOString().split('T')[0];

    if (existingDates[dateKey]) {
      setErrorMessage('Numbers have already been submitted for this date.');
      return;
    }

    const hasAnyValue = Object.entries(formData).some(([key, value]) => key !== 'date' && value && value !== '0');
    if (!hasAnyValue) {
      setErrorMessage('Please enter at least one number before submitting.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    if (typeof onSubmit === 'function') {
      onSubmit(formData);
      setFormData(getReportFormInitialState());
      setIsSubmitting(false);
      return;
    }

    // Default: POST to /api/reports
    try {
      const payload = { ...formData, date: formData.date };
      const { ok, status, data } = await post('/api/reports', payload);

      if (status === 409) {
        setErrorMessage('A report has already been submitted for this date.');
        setIsSubmitting(false);
        return;
      }

      if (!ok) {
        setErrorMessage(getErrorMessage({ status, data }, 'Failed to submit report.'));
        setIsSubmitting(false);
        return;
      }

      setFormData(getReportFormInitialState());
      setErrorMessage('Report submitted successfully.');
    } catch (err) {
      setErrorMessage('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render form layout and fields
  return (
    <div className="entry-page">
      <div className="w-full max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-6">
          Submit CR Friday Night Report
        </h2>
        {isLoadingDates && (
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded mb-4">Loading...</div>
        )}
        {loadError && (
          <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded mb-4">{loadError}</div>
        )}
        {errorMessage && (
          <div
            className={`px-4 py-2 rounded mb-4 ${
              errorMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md space-y-4 px-4 py-6">
          {/* ✅ Date Input */}
          <div>
            <label htmlFor="date" className="block font-medium">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* ✅ Group all numeric inputs */}
          {reportFormFieldKeys.map((key) => (
            <div key={key}>
              <label htmlFor={key} className="block font-medium">{fieldLabels[key]}:</label>
              <input
                type="number"
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          ))}

          {/* ✅ Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CRForm;