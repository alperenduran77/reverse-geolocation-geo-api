const express = require('express');
const router = express.Router();
const Country = require('../models/Country');

// Route to get all countries with pagination
router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // Default to 10 if not specified
  const skip = parseInt(req.query.skip) || 0;   // Default to 0 if not specified

  try {
    const countries = await Country.find().limit(limit).skip(skip);
    res.json(countries);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
