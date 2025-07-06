const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const ScanResult = require('./models/ScanResult');
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

  // Insert new data
  await ScanResult.insertMany(sampleData);
});


afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});