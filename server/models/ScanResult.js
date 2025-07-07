const mongoose = require('mongoose');

const subNodeSchema = new mongoose.Schema({
  id: String,
  data: mongoose.Schema.Types.Mixed,
  relatedNodes: [String],
  impact: String,
  message: String,
});

const nodeSchema = new mongoose.Schema({
  html: String,
  target: [String],
  failureSummary: String,
  impact: String,
  any: [subNodeSchema],
  all: [subNodeSchema],
  none: [subNodeSchema],
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
  testName: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  violations: [violationSchema]
});

const ScanResult = mongoose.model('ScanResult', scanResultSchema);

module.exports = ScanResult;