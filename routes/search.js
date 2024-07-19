const express = require('express');
const router = express.Router();
const Country = require('../models/Country');

// Route to search country by name
router.get('/country', async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: 'Country name is required' });
  }

  try {
    const country = await Country.findOne({ name });
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    console.log(`Entered Country: ${name}`);
    console.log(`Latitude: ${country.lat}`);
    console.log(`Longitude: ${country.lon}`);

    res.json({ lat: country.lat, lon: country.lon });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to search country by coordinates
router.get('/coordinates', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const latFloat = parseFloat(lat);
    const lonFloat = parseFloat(lon);

    const country = await Country.findOne({ lat: latFloat, lon: lonFloat });
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    console.log(`Latitude: ${lat}`);
    console.log(`Longitude: ${lon}`);
    console.log(`Found Country: ${country.name}`);

    res.json(country);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
