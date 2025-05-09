// File: frontend/src/pages/CRForm.jsx

/*
  CRForm is the main input form for entering Celebrate Recovery Friday night data.
  - Checks for duplicate submissions by date
  - Requires at least one non-zero input before submitting
  - Sends data to parent handler via onSubmit
*/

// ✅ Import necessary dependencies
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ✅ CRForm handles input from the user for a new Celebrate Recovery report
const CRForm = ({ onSubmit }) => {
  // Form state
  const [formData, setFormData] = useState({
    date: '',
    largeGroupChurch: '',
    children: '',
    childrenWorkers: '',
    blueChips: '',
    donations: '',
    salesFromBooks: '',
    foodDonation: '',
    mealsServed: '',
    teens: '',
    mensLifeIssues: '',
    mensAddiction: '',
    womensAddiction: '',
    womensLifeIssues: '',
    newBeginnings: '',
    baptisms: '',
  });

  // Date validation helpers
  const [existingDates, setExistingDates] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  // Load existing report dates to prevent duplicate submissions
  useEffect(() => {
    axios.get('/api/reports')
      .then(response => {
        const dateMap = {};
        response.data.forEach(item => {
          if (item.date) {
            const dateKey = new Date(item.date).toISOString().split('T')[0];
            console.log('Fetched dateKey:', dateKey); // ✅ Log for debugging
            dateMap[dateKey] = true;
          }
        });
        setExistingDates(dateMap);
      })
      .catch(error => {
        console.error('Error fetching existing reports:', error);
      });
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
  const handleSubmit = (e) => {
    e.preventDefault();
    const dateKey = new Date(formData.date).toISOString().split('T')[0];
    console.log('Submitting for dateKey:', dateKey); // ✅ Log for debugging

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
    onSubmit(formData);
    setFormData({
      date: '',
      largeGroupChurch: '',
      children: '',
      childrenWorkers: '',
      blueChips: '',
      donations: '',
      salesFromBooks: '',
      foodDonation: '',
      mealsServed: '',
      teens: '',
      mensLifeIssues: '',
      mensAddiction: '',
      womensAddiction: '',
      womensLifeIssues: '',
      newBeginnings: '',
      baptisms: '',
    });
  };

  // Render form layout and fields
  return (
    <div className="entry-page">
      <div className="w-full max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-6">
          Submit CR Friday Night Report
        </h2>
        {errorMessage && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
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
          {[
            ['largeGroupChurch', 'Large Group Church'],
            ['children', 'Children'],
            ['childrenWorkers', 'Children Workers'],
            ['blueChips', 'Blue Chips'],
            ['donations', 'Donations'],
            ['salesFromBooks', 'Sales from Books'],
            ['foodDonation', 'Food Donation'],
            ['mealsServed', 'Meals Served'],
            ['teens', 'Teens'],
            ['mensLifeIssues', "Men's Life Issues"],
            ['mensAddiction', "Men's Addiction"],
            ['womensAddiction', "Women's Addiction"],
            ['womensLifeIssues', "Women's Life Issues"],
            ['newBeginnings', 'New Beginnings'],
            ['baptisms', 'Baptisms'],
          ].map(([name, label]) => (
            <div key={name}>
              <label htmlFor={name} className="block font-medium">{label}:</label>
              <input
                type="number"
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          ))}

          {/* ✅ Submit Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default CRForm;