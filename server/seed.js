const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ScanResult = require('./models/ScanResult');

dotenv.config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await ScanResult.deleteMany({});
    console.log('Cleared existing data');

    // Read sample data
    const sampleDataPath = path.join(__dirname, 'sample-data.json');
    const sampleData = JSON.parse(fs.readFileSync(sampleDataPath, 'utf8'));
    console.log('Read sample data');

    // Insert new data
    await ScanResult.insertMany(sampleData);
    console.log('Sample data inserted successfully');

    await mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();