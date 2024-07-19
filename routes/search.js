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
router.get('/coordinatesCountry', async (req, res) => {
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

const City = require('../models/City'); // Ensure this path is correct

// Route to search city by name
router.get('/city', async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    const city = await City.findOne({ name: new RegExp(name, 'i') }); // Case-insensitive search
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    console.log(`Entered City: ${name}`);
    console.log(`Latitude: ${city.lat}`);
    console.log(`Longitude: ${city.lon}`);

    res.json({ name: city.name, lat: city.lat, lon: city.lon });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to search city by coordinates
router.get('/coordinatesCity', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const latFloat = parseFloat(lat);
    const lonFloat = parseFloat(lon);

    if (isNaN(latFloat) || isNaN(lonFloat)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude' });
    }

    const city = await City.findOne({ lat: latFloat, lon: lonFloat });
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    console.log(`Latitude: ${lat}`);
    console.log(`Longitude: ${lon}`);
    console.log(`Found City: ${city.name}`);

    res.json({ name: city.name, lat: city.lat, lon: city.lon });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;
