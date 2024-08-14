const express = require('express');
const router = express.Router();
const Country = require('../models/Country');
const State = require('../models/State');
const mongoose = require('mongoose');

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Get all countries with specified fields
// Example: http://localhost:3000/countries?fields=name,latitude,longitude
// Example: http://localhost:3000/countries
// Example: http://localhost:3000/countries?fields=name,latitude,longitude&limit=10&skip=1
/**
 * @swagger
 * /countries:
 *   get:
 *     summary: Get all countries with specified fields
 *     description: Retrieve a list of countries with optional fields, limit, and skip parameters. Optionally populate states.
 *     parameters:
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Comma-separated list of fields to include (e.g., 'name,latitude,longitude').
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit the number of results returned.
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *         description: Number of results to skip before starting to collect the results.
 *     responses:
 *       200:
 *         description: A list of countries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Turkey
 *                   latitude:
 *                     type: number
 *                     example: 39.0000
 *                   longitude:
 *                     type: number
 *                     example: 35.0000
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  const fields = req.query.fields ? req.query.fields.split(',').join(' ') : 'name id';
  const limit = parseInt(req.query.limit) || 0;
  const skip = parseInt(req.query.skip) || 0;

  try {
    // Populate states if requested
    let query = Country.find({}, fields).limit(limit).skip(skip);
    if (req.query.fields && req.query.fields.includes('states')) {
      query = query.populate('states', 'name state_code latitude longitude country_id');
    }
    const countries = await query.exec();
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get country by name or ID with specified fields
// Example: http://localhost:3000/countries/Turkey
// Example: http://localhost:3000/countries/Turkey?fields=name,capital
// Example: http://localhost:3000/countries/Turkey?fields=name,latitude,longitude

// Example: http://localhost:3000/countries/669f48d748786a4ad3f52101
// Example: http://localhost:3000/countries/669f48d748786a4ad3f52101?fields=name,latitude,longitude
// Example: http://localhost:3000/countries/669f48d748786a4ad3f52101?fields=name,capital
/**
 * @swagger
 * /countries/{identifier}:
 *   get:
 *     summary: Get a country by name or ID with specified fields
 *     description: Retrieve a specific country by its name or ID, optionally with selected fields. Optionally populate states.
 *     parameters:
 *       - in: path
 *         name: identifier
 *         schema:
 *           type: string
 *         required: true
 *         description: Country name or ObjectId
 *         example: Turkey
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Comma-separated list of fields to include (e.g., 'name,capital').
 *     responses:
 *       200:
 *         description: A specific country
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: Turkey
 *                 latitude:
 *                   type: number
 *                   example: 39.0000
 *                 longitude:
 *                   type: number
 *                   example: 35.0000
 *       404:
 *         description: Country not found
 *       500:
 *         description: Internal server error
 */
router.get('/:identifier', async (req, res) => {
  const fields = req.query.fields ? req.query.fields.split(',').join(' ') : 'name id';
  const { identifier } = req.params;

  try {
    let query;
    if (isValidObjectId(identifier)) {
      // If identifier is a valid ObjectId, search by ID
      query = Country.findById(identifier, fields);
    } else {
      // Otherwise, search by name (case-insensitive)
      query = Country.findOne({ name: new RegExp('^' + identifier + '$', 'i') }, fields);
    }

    if (req.query.fields && req.query.fields.includes('states')) {
      query = query.populate('states', 'name state_code latitude longitude country_id');
    }

    const country = await query.exec();
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }
    res.json(country);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
