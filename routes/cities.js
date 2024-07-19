const express = require('express');
const router = express.Router();
const City = require('../models/City');

// Get all cities
router.get('/', async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get city by name
router.get('/:name', async (req, res) => {
  try {
    const city = await City.findOne({ name: req.params.name });
    if (city == null) {
      return res.status(404).json({ message: 'Cannot find city' });
    }
    res.json(city);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
