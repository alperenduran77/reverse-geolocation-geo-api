const express = require('express');
const router = express.Router();
const Country = require('../models/Country');

// Get all countries
// http://localhost:3000/countries
router.get('/', async (req, res) => {
  try {
    const countries = await Country.find();
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
  // Get country by ID
  // http://localhost:3000/countries/669f48d748786a4ad3f52101
  router.get('/:countryId', async (req, res) => {
      
    try {

      const country = await Country.findById(req.params.countryId);
      if (!country) {
        return res.status(404).json({ message: 'Country not found' });
      }
      res.json(country);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  );

module.exports = router;
