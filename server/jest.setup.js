const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { ScanResultFromJson, ScanResult } = require('./models/ScanResult');
const { Project } = require('./models/Project');
const fs = require('fs');
const path = require('path');

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // Read sample data
  const sampleDataPath = path.join(__dirname, 'sample-data.json');
  const sampleData = JSON.parse(fs.readFileSync(sampleDataPath, 'utf8'));
  const scanResults = [];
  // Insert new data
  const project = new Project({
    name: 'Sample Project',
    description: 'This is a sample project for seeding the database.',
    createdAt: new Date(),
    updatedAt: new Date(),
    pageUrl: 'http://example.com'
  });
  const pr = await project.save();
  for (const item of sampleData) {
    const newScanResult = ScanResultFromJson(item);
    newScanResult.projectId = pr._id; // Set the project ID
    scanResults.push(newScanResult);
  }
  await ScanResult.insertMany(scanResults);
});


afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});