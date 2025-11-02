const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { ScanResult, ScanResultFromJson } = require('./models/ScanResult');
const { Project } = require('./models/Project');

dotenv.config();

async function seedDatabase(clearOnly = false) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Project.deleteMany({});
    await ScanResult.deleteMany({});
    console.log('Cleared existing data');

    if (clearOnly) {
      console.log('Clear only mode - skipping data insertion');
    } else {
      // Read sample data
      const sampleDataPath = path.join(__dirname, 'sample-data.json');
      const sampleData = JSON.parse(fs.readFileSync(sampleDataPath, 'utf8'));
      console.log('Read sample data');

      // Insert new data
      const project = new Project({
        name: 'Sample Project',
        description: 'This is a sample project for seeding the database.',
        createdAt: new Date(),
        updatedAt: new Date(),
        pageUrl: 'http://example.com'
      });
      const pr = await project.save();
      const scanResults = [];
      for (const item of sampleData) {
        const newScanResult = ScanResultFromJson(item);
        newScanResult.projectId = pr._id; // Set the project ID
        scanResults.push(newScanResult);
      }
      await ScanResult.insertMany(scanResults);
      console.log('Sample data inserted successfully');
    }

    await mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

async function updateScanResultsCreatedDates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for updating createdAt dates');
    // randomDate from 30 to 1 days ago
    const scanResults = await ScanResult.find({});
    for (const result of scanResults) {
      const randomDate = new Date(Date.now() - Math.floor(Math.random() * 15 + 1) * 24 * 60 * 60 * 1000);
      result.created = randomDate;
      await result.save();
    }
    console.log('Updated createdAt dates for scan results');
  } catch (error) {
    console.error('Error updating createdAt dates:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed after updating dates');
  }
}

// updateScanResultsCreatedDates();
// You can now call it with true to only clear the database
const clearOnly = process.argv.includes('--clear-only');
seedDatabase(clearOnly);