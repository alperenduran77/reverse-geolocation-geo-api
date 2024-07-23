const express = require('express');
const router = express.Router();
const Country = require('../models/Country');

// Get all countries
router.get('/', async (req, res) => {
  try {
    const countries = await Country.find();
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get country by name
router.get('/:name', async (req, res) => {
  try {
    const country = await Country.findOne({ name: req.params.name }).populate({
      path: 'states',
      populate: { path: 'cities' } // Nested populate to include cities within states
    });
    if (!country) {
      return res.status(404).json({ message: 'Cannot find country' });
    }
    res.json(country);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get states by country name
router.get('/:name/states', async (req, res) => {
  try {
    const country = await Country.findOne({ name: req.params.name }).populate('states');
    if (!country) {
      return res.status(404).json({ message: 'Cannot find country' });
    }
    res.json(country.states);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
