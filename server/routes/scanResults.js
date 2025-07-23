const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const { createReadStream } = require('fs');
const { ScanResult, ScanResultFromJson } = require('../models/ScanResult');
const { Error } = require('mongoose');
const { Project } = require('../models/Project');
const { projectCheck } = require('../middlewares/project');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

/* Get all scan results
 * @returns {Array} - An array of all scan results
 * @throws {Error} - If there is an issue retrieving the scan results
 * Example: GET /scan-results
 */
router.get('/', projectCheck, async (req, res) => {
  try {
    const projectId = req.projectId;
    const scanResults = await ScanResult.find({ projectId }).select({ _id: 1, testName: 1, url: 1, created: 1, impactCounts: 1, violations: 1, totalViolations: 1 }).sort({ created: 1 });
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
router.get('/page/:page', projectCheck, async (req, res) => {
  const projectId = req.project_id;
  const page = Math.max(parseInt(req.params.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 50, 100); // Default limit to 50 if not provided
  try {
    const skip = (page - 1) * limit;  // Calculate the number of documents to skip

    const scanResults = await ScanResult.find({ projectId }).select({ _id: 1, testName: 1, url: 1, created: 1, impactCounts: 1, violations: 1, totalViolations: 1 }).sort({ created: 1 }).skip(skip).limit(limit);
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
router.get('/year/:year', projectCheck, async (req, res) => {
  try {
    const projectId = req.project_id;
    const { year } = req.params;
    const scanResults = await ScanResult.find({
      projectId,
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
router.post('/upload', upload.single('file'), projectCheck, async (req, res) => {
  const projectId = req.project_id;
  try {
    const fileContent = await fs.readFile(req.file.path, 'utf8');
    const scanData = [JSON.parse(fileContent)].flat();

    const scanResults = [];
    const errors = [];

    const { results, errors: parseErrors } = parseResultArray(scanData, projectId);
    scanResults.push(...results);
    errors.push(...parseErrors);
    await upsertScanResults(scanResults);
    res.status(201).json({ message: 'Scan results uploaded successfully', errors });
  } catch (err) { // Handle JSON parsing errors or file read errors
    res.status(400).json({ message: err.message });
  } finally {
    // Clean up the uploaded file
    if (req.file) {
      await fs.unlink(req.file.path);
    }
  }
});

// upload multiple scan result files
router.post('/upload-multiple', upload.array('files'), projectCheck, async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }
  try {
    const projectId = req.project_id;
    const scanResults = [];
    for (const file of req.files) {
      const fileContent = await fs.readFile(file.path, 'utf8');
      const scanData = JSON.parse(fileContent); // Assuming the file contains valid JSON
      const newScanResult = ScanResultFromJson(scanData);
      newScanResult.projectId = projectId; // Set the project ID from the query parameter
      scanResults.push(newScanResult);
      // Clean up the uploaded file
      await fs.unlink(file.path);
    }
    await upsertScanResults(scanResults);
    res.status(201).json({ message: 'Scan results uploaded successfully', count: scanResults.length });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* upload scan results from JSON
  * @param {Object} req - The request object containing the JSON data in the body
  * return 200 if successful
  * @throws {Error} - If the JSON data is invalid or if there is an issue saving it
 */
router.post('/upload-json', projectCheck, async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'No data provided' });
  }
  const scanData = [req.body].flat(); // Assuming the body contains valid JSON
  const projectId = req.project_id;
  const errors = [];
  const scanResults = [];

  const { results, errors: parseErrors } = parseResultArray(scanData, projectId);
  scanResults.push(...results);
  errors.push(...parseErrors);

  await upsertScanResults(scanResults);
  res.status(201).json({ message: 'Scan results uploaded successfully', errors });
});

/* Upload scan results in tar file format
  * @param {Object} req - The request object containing the tar file in the body
  * @returns {Object} - The saved scan result object
  * @throws {Error} - If the tar file is not provided or if there is an issue saving it
  */
router.post('/upload-tar', upload.single('file'), projectCheck, async (req, res) => {
  const projectId = req.query.projectId;
  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // loading this when needed
    const ts = require('tar-stream');
    const { createGunzip } = require('zlib');
    const scans = [];
    const errors = [];
    // make the extraction a promise
    await new Promise((resolve, reject) => {
      const extract = ts.extract();
      extract.on('entry', function (header, stream, next) {
        if (header.type === 'file') {
          let fileContent = '';
          stream.on('data', (chunk) => {
            fileContent += chunk.toString();
          });
          stream.on('end', () => {
            try {
              const scanData = JSON.parse(fileContent);
              scanData.projectId = projectId;
              const { results: newScanResults, errors: parseErrors } = parseResultArray([scanData].flat(), projectId);
              scans.push(...newScanResults);
              errors.push(...parseErrors);
            } catch (err) {
              console.error('Error parsing JSON from tar file:', err);
            }
            next();
          });
          stream.resume();
        } else {
          next();
        }
      });
      extract.on('finish', () => {
        resolve();
      });
      extract.on('error', (err) => {
        reject(err);
      });
      createReadStream(req.file.path)
        .pipe(createGunzip())
        .pipe(extract);
    });

    if (scans.length > 0) {
      await upsertScanResults(scans);
      res.status(201).json({ message: 'Scan results uploaded successfully', count: scans.length, errors });
    } else {
      res.status(400).json({ message: 'No valid scan results found in the tar file' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error processing tar file', error: err.message });
  } finally {
    // Clean up the uploaded file
    if (req.file) {
      await fs.unlink(req.file.path);
    }
  }
});
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

const parseResultArray = (resultArray, projectId) => {
  const errors = [];
  const results = resultArray.map(result => {
    try {
      return ScanResultFromJson({
        ...result,
        projectId
      });
    } catch {
      errors.push({ testName: result.testName, error: 'Invalid scan result format' });
      return null; // Return null for invalid entries
    }
  });
  return { results, errors };
};

/* Take an array of scan results and upsert them into the database using bulkWrite
  * @param {Array} scanResults - An array of scan results to upsert
  * @returns {Promise} - A promise that resolves when the upsert is complete
  */
const upsertScanResults = async (scanResults) => {
  const bulkOps = scanResults.map(result => {
    const createdDate = new Date(result.created);
    const year = createdDate.getFullYear();
    const month = createdDate.getMonth();
    const day = createdDate.getDate();

    return {
      updateOne: {
        filter: {
          testName: result.testName,
          created: {
            $gte: new Date(year, month, day),
            $lt: new Date(year, month, day + 1)
          }
        },
        update: { $set: result },
        upsert: true
      }
    };
  });

  if (bulkOps.length > 0) {
    await ScanResult.bulkWrite(bulkOps);
  }
};

module.exports = router;
