const express = require('express');
const router = express.Router();
const City = require('../models/City');
const State = require('../models/State');

// Get all cities
// http://localhost:3000/cities
router.get('/', async (req, res) => {
  try {
    const cities = await City.find({}, 'name _id latitude longitude state_id');
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get city by ID
// http://localhost:3000/cities/669f48d748786a4ad3f52632
router.get('/:cityId', async (req, res) => {
  try {
    const city = await City.findById(req.params.cityId, 'name _id latitude longitude state_id');
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.json(city);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get all cities by state ID
// http://localhost:3000/cities/state/669f48d748786a4ad3f52630
router.get('/state/:stateId', async (req, res) => {
  const { stateId } = req.params;

  try {
    const cities = await City.find({ state_id: stateId }, 'name _id latitude longitude state_id');
    if (!cities.length) {
      return res.status(404).json({ message: 'No cities found for this state' });
    }
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all cities by state name
// http://localhost:3000/cities/statename/Kocaeli
router.get('/statename/:stateName', async (req, res) => {
  const { stateName } = req.params;

  try {
    const state = await State.findOne({ name: stateName });
    if (!state) {
      return res.status(404).json({ message: 'State not found' });
    }

    const cities = await City.find({ state_id: state._id }, 'name _id latitude longitude state_id');
    if (!cities.length) {
      return res.status(404).json({ message: 'No cities found for this state' });
    }

    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
