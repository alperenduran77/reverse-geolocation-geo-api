const express = require('express');
const router = express.Router();
const Country = require('../models/Country');

router.get('/', async (req, res) => {
  try {
    const countries = await Country.find().populate('states');
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
