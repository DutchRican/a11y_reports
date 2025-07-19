const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const { ScanResult, ScanResultFromJson } = require('../models/ScanResult');
const { Error } = require('mongoose');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

/* Get all scan results
 * @returns {Array} - An array of all scan results
 * @throws {Error} - If there is an issue retrieving the scan results
 * Example: GET /scan-results
 */
router.get('/', async (_req, res) => {
  try {
    const scanResults = await ScanResult.find().select({ _id: 1, testName: 1, url: 1, created: 1, impactCounts: 1, violations: 1, totalViolations: 1 }).sort({ created: 1 });
    res.json(scanResults);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Get paginated scan results
  * @param {number} page - The page number to retrieve (1-based index)
  * @query {number} limit - The number of results per page (default: 50, max: 100)
  * @returns {Array} - An array of scan results for the specified page
  * @throws {Error} - If there is an issue retrieving the scan results
  * Example: GET /scan-results/page/2?limit=20
  */
router.get('/page/:page', async (req, res) => {
  const page = Math.max(parseInt(req.params.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 50, 100); // Default limit to 50 if not provided
  try {
    const skip = (page - 1) * limit;  // Calculate the number of documents to skip

    const scanResults = await ScanResult.find().select({ _id: 1, testName: 1, url: 1, created: 1, impactCounts: 1, violations: 1, totalViolations: 1 }).sort({ created: 1 }).skip(skip).limit(limit);
    res.json(scanResults);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Get scan results by year
 * @param {number} year - The year to filter scan results by
 * @returns {Array} - An array of scan results created in the specified year
 * @throws {Error} - If there is an issue retrieving the scan results
 * Example: GET /scan-results/year/2023
 */
router.get('/year/:year', async (req, res) => {
  try {
    const { year } = req.params;
    const scanResults = await ScanResult.find({
      created: {
        $gte: new Date(`${year}-01-01`),
        $lt: new Date(`${year + 1}-01-01`)
      }
    });
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
    if (err instanceof Error.CastError) {
      return res.status(404).json({ message: 'Invalid ID' });
    }
    return res.status(500).json({ message: err.message });
  }
});

/* * Upload a scan result file
 * @param {Object} req - The request object containing the file in the body
 * @returns {Object} - The saved scan result object
 * @throws {Error} - If the file is not provided or if there is an issue saving it
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const fileContent = await fs.readFile(req.file.path, 'utf8');
    const scanData = JSON.parse(fileContent);
    const newScanResult = ScanResultFromJson(scanData);
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

// upload multiple scan result files
router.post('/upload-multiple', upload.array('files'), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }
  try {
    const scanResults = [];
    for (const file of req.files) {
      const fileContent = await fs.readFile(file.path, 'utf8');
      const scanData = JSON.parse(fileContent); // Assuming the file contains valid JSON
      const newScanResult = ScanResultFromJson(scanData);
      scanResults.push(newScanResult);
      // Clean up the uploaded file
      await fs.unlink(file.path);
    }
    const savedScanResults = await ScanResult.insertMany(scanResults);
    res.status(201).json(savedScanResults);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* upload scan results from JSON
  * @param {Object} req - The request object containing the JSON data in the body
  * return 200 if successful
  * @throws {Error} - If the JSON data is invalid or if there is an issue saving it
 */
router.post('/upload-json', async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'No data provided' });
  }
  const scanData = [req.body].flat(); // Assuming the body contains valid JSON

  const errors = [];
  for (const scan of scanData) {
    try {
      const newScanResult = ScanResultFromJson(scan);
      await newScanResult.save();
    } catch (err) {
      errors.push({ testName: scan.testName, error: err.message });
    }
  }
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Some scan results could not be saved', errors });
  } else {
    res.status(201).json({ message: 'Scan results uploaded successfully' });
  }
});

// /* Upload scan results in tar file format
//   * @param {Object} req - The request object containing the tar file in the body
//   * @returns {Object} - The saved scan result object
//   * @throws {Error} - If the tar file is not provided or if there is an issue saving it
//   */
// router.post('/upload-tar', upload.single('file'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'No file uploaded' });
//   }
//   try {
//     const tarFile = await fs.readFile(req.file.path, 'utf8');
//     const extract = require('tar-stream').extract();
//     extract.on('entry', async (header, stream, next) => {
//       let fileContent = '';
//       stream.on('data', (chunk) => {
//         fileContent += chunk.toString();
//       });
//       stream.on('end', async () => {
//         next();
//       });
//       stream.resume();
//     });
//     extract.on('finish', async () => {
//     });
//     tarFile.pipe(extract);


//     const scanData = JSON.parse(fileContent);
//     const newScanResult = ScanResultFromJson(scanData);
//     const savedScanResult = await newScanResult.save();
//     res.status(201).json(savedScanResult);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   } finally {
//     // Clean up the uploaded file
//     if (req.file) {
//       await fs.unlink(req.file.path);
//     }
//   }
// });

/* * Delete a scan result by ID
 * @param {string} id - The ID of the scan result to delete
 * @returns {Object} - A message indicating the deletion status
 * @throws {Error} - If the scan result is not found or if there is an issue deleting it
 */
router.delete('/:id', async (req, res) => {
  try {
    const scanResult = await ScanResult.findByIdAndDelete(req.params.id);
    if (!scanResult) {
      return res.status(404).json({ message: 'Scan result not found' });
    }
    res.json({ message: 'Scan result deleted successfully' });
  } catch (err) {
    if (err instanceof Error.CastError) {
      return res.status(404).json({ message: 'Invalid ID' });
    }
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
