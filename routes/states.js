const express = require('express');
const router = express.Router();
const State = require('../models/State');

router.get('/', async (req, res) => {
  try {
    const states = await State.find().populate('cities');
    res.json(states);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
