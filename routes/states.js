const express = require('express');
const router = express.Router();
const Country = require('../models/Country');
const State = require('../models/State');

// List all states for a given country ID
router.get('/country/:countryId', async (req, res) => {
  try {
    const states = await State.find({ country_id: req.params.countryId });
    if (states.length === 0) {
      return res.status(404).json({ message: 'No states found for this country' });
    }
    res.json(states);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List all states for a given country name
router.get('/countryname/:countryName', async (req, res) => {
  try {
    const country = await Country.findOne({ name: req.params.countryName });
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }

    const states = await State.find({ country_id: country._id });
    if (states.length === 0) {
      return res.status(404).json({ message: 'No states found for this country' });
    }
    res.json(states);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search state by name or latitude and longitude
router.get('/', async (req, res) => {
  const { name, latitude, longitude } = req.query;

  try {
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (latitude && longitude) {
      query.latitude = latitude;
      query.longitude = longitude;
    }

    const states = await State.find(query);

    if (states.length === 0) {
      return res.status(404).json({ message: 'No states found matching the criteria.' });
    }

    res.json(states);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
