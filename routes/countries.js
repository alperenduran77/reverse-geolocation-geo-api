const express = require('express');
const router = express.Router();
const Country = require('../models/Country');
const State = require('../models/State');

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
// Get country by name
// Example: http://localhost:3000/countries/Turkey
// Example: http://localhost:3000/countries/Turkey?fields=name,capital
// Example: http://localhost:3000/countries/Turkey?fields=name,latitude,longitude
router.get('/:countryName', async (req, res) => {
  const fields = req.query.fields ? req.query.fields.split(',').join(' ') : 'name id';
  try {
    let query = Country.findOne({ name: new RegExp('^' + req.params.countryName + '$', 'i') }, fields);
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

// Get country by ID
// Example: http://localhost:3000/countries/669f48d748786a4ad3f52101
// Example: http://localhost:3000/countries/669f48d748786a4ad3f52101?fields=name,latitude,longitude
// Example: http://localhost:3000/countries/669f48d748786a4ad3f52101?fields=name,capital
router.get('/:countryId', async (req, res) => {
  const fields = req.query.fields ? req.query.fields.split(',').join(' ') : null;

  try {
    // Populate states if requested
    let query = Country.findById(req.params.countryId, fields);
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
