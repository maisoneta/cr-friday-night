// File: frontend/src/pages/DynamicEntryPage.jsx

/*
  HighestSingleDayValueTable component renders a table showing
  the highest recorded value per category with associated date.
  Used in the CRDashboard to highlight peak single-day statistics.
*/

import React from 'react';

const HighestSingleDayValueTable = ({ data }) => {
  // Map of short codes to full descriptive labels for categories
  // Mapping of abbreviations to verbose labels
  const categoryLabels = {
    'LgGp': 'Large Gp/Children/Workers',
    'Kid': 'Children',
    'Wrkr': 'Children Workers',
    'TotAttnd': 'Total Attendance',
    'Don': 'Donations',
    'Book$': 'Sales from Books',
    'Food$': 'Food Donation',
    'T-Funds': 'Total Funds',
    'Meal': 'Meals Served',
    'Chip': 'Blue Chips',
    'Teen': 'Teens',
    'MLI': "Men's Life Issues",
    'MAdd': "Men's Addiction",
    'WAdd': "Women's Addiction",
    'WLI': "Women's Life Issues",
    'NB': 'New Beginnings',
    'TSG': 'Step Study Graduates',
    'Bap': 'Baptisms',
    'Grad': 'Graduates'
  };

  // Render a simple 3-column table showing category, value, and date
  return (
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Value</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ category, value, date }) => (
          <tr key={category}>
            <td>{categoryLabels[category] || category}</td>
            <td>{value}</td>
            <td>{date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HighestSingleDayValueTable;