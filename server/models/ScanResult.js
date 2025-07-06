const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  html: String,
  target: [String],
  failureSummary: String,
  impact: String
});

const violationSchema = new mongoose.Schema({
  description: String,
  help: String,
  helpUrl: String,
  id: String,
  impact: {
    type: String,
    enum: ['critical', 'serious', 'moderate', 'minor']
  },
  nodes: [nodeSchema],
  tags: [String]
});

const scanResultSchema = new mongoose.Schema({
  specName: {
    type: String,
    required: true
  },
  pageUrl: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  violations: [violationSchema]
});

const ScanResult = mongoose.model('ScanResult', scanResultSchema);

module.exports = ScanResult;