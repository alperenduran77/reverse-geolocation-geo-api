const express = require('express');
const router = express.Router();
const Country = require('../models/Country');

router.get('/', async (req, res) => {
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

module.exports = router;
