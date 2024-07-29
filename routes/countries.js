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
