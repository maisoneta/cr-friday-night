// frontend/src/CRForm.jsx
import React, { useState } from 'react';

const initialFormState = {
  date: '',
  largeGroupChurch: 0,
  children: 0,
  childrenWorkers: 0,
  blueChips: 0,
  donations: 0,
  teens: 0,
  mensLifeIssues: 0,
  mensAddiction: 0,
  womensAddiction: 0,
  womensLifeIssues: 0,
  newBeginnings: 0,
  baptisms: 0,
  mealsServed: 0,
  bookSales: 0,
  foodDonation: 0,
  approved: false,
};

const CRForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : Number(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const result = await res.json();
        if (onSubmitSuccess) onSubmitSuccess(); // ✅ trigger dashboard refresh
        setFormData(initialFormState); // reset form
      } else {
        console.error('Failed to submit:', await res.text());
      }
    } catch (err) {
      console.error('Error submitting:', err);
    }

    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={(e) =>
            setFormData({ ...formData, date: e.target.value })
          }
          required
          className="w-full border p-2 rounded"
        />
      </div>

      {Object.keys(initialFormState)
        .filter((key) => key !== 'date' && key !== 'approved')
        .map((key) => (
          <div key={key}>
            <label className="block font-medium capitalize">{key}</label>
            <input
              type="number"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        ))}

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="approved"
          checked={formData.approved}
          onChange={handleChange}
        />
        <label className="font-medium">Approved</label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {submitting ? 'Submitting...' : 'Submit Report'}
      </button>
    </form>
  );
};

export default CRForm;