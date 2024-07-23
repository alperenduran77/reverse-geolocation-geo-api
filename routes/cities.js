// routes/cities.js
const express = require('express');
const router = express.Router();
const City = require('../models/City');
const State = require('../models/State');

// Get all cities by state ID
router.get('/state/:stateId', async (req, res) => {
  const { stateId } = req.params;

  try {
    const cities = await City.find({ state_id: stateId });
    if (!cities.length) {
      return res.status(404).json({ message: 'No cities found for this state' });
    }
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all cities by state name
router.get('/statename/:stateName', async (req, res) => {
  const { stateName } = req.params;

  try {
    const state = await State.findOne({ name: stateName });
    if (!state) {
      return res.status(404).json({ message: 'State not found' });
    }

    const cities = await City.find({ state_id: state._id });
    if (!cities.length) {
      return res.status(404).json({ message: 'No cities found for this state' });
    }

    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
