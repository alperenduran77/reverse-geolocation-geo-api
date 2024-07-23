// routes/states.js
const express = require('express');
const router = express.Router();
const State = require('../models/State');
const Country = require('../models/Country');

// Get all states by country ID
router.get('/country/:countryId', async (req, res) => {
  const { countryId } = req.params;

  try {
    const states = await State.find({ country_id: countryId });
    if (!states.length) {
      return res.status(404).json({ message: 'No states found for this country' });
    }
    res.json(states);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all states by country name
router.get('/countryname/:countryName', async (req, res) => {
  const { countryName } = req.params;

  try {
    const country = await Country.findOne({ name: countryName });
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }

    const states = await State.find({ country_id: country._id });
    if (!states.length) {
      return res.status(404).json({ message: 'No states found for this country' });
    }

    res.json(states);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
