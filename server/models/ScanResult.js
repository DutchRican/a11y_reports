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
  violations: [violationSchema],
  impactCounts: {
    critical: { type: Number, default: 0 },
    serious: { type: Number, default: 0 },
    moderate: { type: Number, default: 0 },
    minor: { type: Number, default: 0 }
  },
  totalViolations: { type: Number, default: 0 }
});

const ScanResult = mongoose.model('ScanResult', scanResultSchema);

const ScanResultFromJson = (json) => {
  const { critical, serious, moderate, minor } = getViolationsByImpact(json);
  console.log(json.testName, critical)
  const scanResult = new ScanResult({
    ...json,
    created: json.created || new Date(),
    violations: json.violations || [],
    impactCounts: {
      critical: critical || 0,
      serious: serious || 0,
      moderate: moderate || 0,
      minor: minor || 0
    },
    totalViolations: critical + serious + moderate + minor,
  });
  return scanResult;
};

const getViolationsByImpact = (scanResult) => {
  const { critical, serious, moderate, minor } = scanResult.violations.reduce(
    (acc, violation) => {
      acc[violation.impact] = acc[violation.impact] + 1;
      return acc;
    },
    { critical: 0, serious: 0, moderate: 0, minor: 0 }
  );
  return { critical, serious, moderate, minor };
};

module.exports = { ScanResult, ScanResultFromJson, getViolationsByImpact };