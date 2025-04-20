// ✅ Import necessary dependencies from React and useState hook
import React, { useState } from 'react';

// ✅ CRForm handles input from the user for a new Celebrate Recovery report
// Fields represent attendance, donations, group participation, and more
const CRForm = ({ onSubmit }) => {
  // ✅ Local state to hold all form fields
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

  // ✅ Handle changes in input fields and update the local state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ✅ Handle form submission by calling parent `onSubmit` with form data
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent full page reload
    onSubmit(formData); // Call the callback from the parent with data
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
    }); // ✅ Reset form after submission
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md space-y-4">
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
  );
};

// ✅ Export the CRForm component to be used in the frontend application
export default CRForm;