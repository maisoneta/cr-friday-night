// ✅ Import necessary dependencies
import React, { useState } from 'react';

// ✅ CRForm handles input from the user for a new Celebrate Recovery report
const CRForm = ({ onSubmit }) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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

  return (
    <div className="entry-page">
      <div className="w-full max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-6">
          Submit CR Friday Night Report
        </h2>
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