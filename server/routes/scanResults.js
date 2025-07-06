const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const ScanResult = require('../models/ScanResult');
const { CastError } = require('mongoose');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Get all scan results
router.get('/', async (_req, res) => {
  try {
    const scanResults = await ScanResult.find().sort({ timestamp: 1 });
    res.json(scanResults);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single scan result
router.get('/:id', async (req, res) => {
  try {
    const scanResult = await ScanResult.findById(req.params.id);
    if (!scanResult) {
      return res.status(404).json({ message: 'Scan result not found' });
    }
    return res.json(scanResult);
  } catch (err) {
    if (err instanceof CastError) {
      return res.status(404).json({ message: 'Invalid scan result ID' });
    }
    return res.status(500).json({ message: err.message });
  }
});

// Upload new scan result
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const fileContent = await fs.readFile(req.file.path, 'utf8');
    const scanData = JSON.parse(fileContent);

    const newScanResult = new ScanResult({
      ...scanData,
      timestamp: scanData.timestamp || new Date(),
      violations: scanData.violations || [],
    });

    const savedScanResult = await newScanResult.save();
    res.status(201).json(savedScanResult);
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    // Clean up the uploaded file
    if (req.file) {
      await fs.unlink(req.file.path);
    }
  }
});
module.exports = router;
