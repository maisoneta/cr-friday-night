// backend/utils/convertFoodDonationToDouble.js

const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'your-mongodb-connection-string-here';

async function convertFoodDonationToDouble() {
  try {
    await mongoose.connect(MONGO_URI);

    const Report = mongoose.connection.collection('reports');

    const result = await Report.updateMany(
      {
        foodDonation: { $exists: true, $type: 'int' }
      },
      [
        {
          $set: {
            foodDonation: { $toDouble: "$foodDonation" }
          }
        }
      ]
    );

    console.log(`✅ Converted ${result.modifiedCount} foodDonation fields from Int32 to Double.`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

convertFoodDonationToDouble();