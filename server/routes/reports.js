const express = require('express');
const { ScanResult } = require('../models/ScanResult');
const { projectCheck } = require('../middlewares/project');
const router = express.Router();

const impactLevels = {
  minor: 0,
  moderate: 1,
  serious: 2,
  critical: 3,
};

const THIRTYDAYS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

/**
 * Get the top x violations for a project.
 * @param {string} projectId - The ID of the project.
 * @param {string} impact - The minimum impact level to consider.
 * @param {limit} limit - Count of violations to return. default is 5
 * @returns {Array} - A list of the top x violations.
 */
router.get('/results-with-issues', projectCheck, async (req, res) => {
  try {
    const projectId = req.project_id;
    const minImpact = req.query.impact || 'serious';
    const limit = parseInt(req.query.limit, 10) || 5;

    const minImpactLevel = impactLevels[minImpact];
    if (minImpactLevel === undefined) {
      return res.status(400).json({ message: 'Invalid impact level' });
    }

    const aggregation = [
      // Match the project
      { $match: { projectId } },
      // Sort by creation date to get the latest scans first
      { $sort: { created: -1 } },
      // Group by URL to get the latest scan for each URL
      {
        $group: {
          _id: '$url',
          latestScan: { $first: '$$ROOT' },
        },
      },
      // Unwind the violations array
      { $unwind: '$latestScan.violations' },
      // Replace the root with the violations
      { $replaceRoot: { newRoot: '$latestScan.violations' } },
      // Filter violations by impact level
      {
        $match: {
          $expr: {
            $gte: [
              { $ifNull: [{ $indexOfArray: [Object.keys(impactLevels), '$impact'] }, -1] },
              minImpactLevel,
            ],
          },
        },
      },
      // Group by help text and count violations
      {
        $group: {
          _id: { help: '$help', impact: '$impact' },
          count: { $sum: 1 },
          url: { $first: '$url' },
        },
      },
      // Sort by count
      { $sort: { count: -1 } },
      // Limit to the top 5
      { $limit: limit },
      // Project the final fields
      {
        $project: {
          _id: 0,
          description: '$_id.description',
          help: '$_id.help',
          impact: '$_id.impact',
          count: 1,
          url: 1,
        },
      },
    ];

    const sortedViolations = await ScanResult.aggregate(aggregation);
    res.json(sortedViolations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get the URLs with most issues for a project.
 * URLs are grouped and collapsed by ID
 * examply https://example.com/23434/test/545454 will become https://example.com/:id/test/:id
 * @param {string} projectId - The ID of the project.
 * @param {number} limit - The maximum number of URLs to return.
 * @param {string} from - The start date to consider (ISO format). Defaults to 30 days ago.
 * @returns {Array} - A list of URLs with the most issues.
 */
router.get('/urls-with-issues', projectCheck, async (req, res) => {
  try {
    const projectId = req.project_id;
    const limit = parseInt(req.query.limit, 10) || 5;
    const fromDate = req.query.from
      ? new Date(req.query.from)
      : new Date(Date.now() - THIRTYDAYS);

    // Helper to collapse IDs or hashes in URLs
    function collapseUrl(url) {
      // Replace segments that look like IDs or hashes (numbers or hex strings) with :id
      return url.replace(/\/([a-fA-F0-9]{6,}|\d+)(\b|(?=\/))/g, '/:id');
    }

    // Get scan results for project in date range
    const scanResults = await ScanResult.find({
      projectId,
      created: { $gte: fromDate },
    }).lean();

    // Count issues per collapsed URL
    const urlCounts = {};
    scanResults.forEach(result => {
      const collapsedUrl = collapseUrl(result.url);
      const count = Array.isArray(result.violations) ? result.violations.length : 0;
      urlCounts[collapsedUrl] = urlCounts[collapsedUrl] ? urlCounts[collapsedUrl] + count : count;
    });

    // Sort and limit
    const sorted = Object.entries(urlCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([url, count]) => ({ url, count }));

    res.json(sorted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;