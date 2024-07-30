const express = require('express');
const router = express.Router();
const Country = require('../models/Country');
const State = require('../models/State');

// List all states
// http://localhost:3000/states
router.get('/', async (req, res) => {
  try {
    const states = await State.find({}, 'name _id latitude longitude country_id');
    res.json(states);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get state by ID
// http://localhost:3000/states/669f48d748786a4ad3f52630
router.get('/:stateId', async (req, res) => {
  try {
    const state = await State.findById(req.params.stateId, 'name _id latitude longitude country_id');
    if (!state) {
      return res.status(404).json({ message: 'State not found' });
    }
    res.json(state);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Gett state by name
// http://localhost:3000/states/name/İstanbul
router.get('/name/:stateName', async (req, res) => {
  try {
    const state = await State.findOne({ name: req.params.stateName }, 'name _id latitude longitude country_id');
    if (!state) {
      return res.status(404).json({ message: 'State not found' });
    }
    res.json(state);
  } catch (err) {
    res.status500().json({ message: err.message });
  }
});

// List all states for a given country ID
// http://localhost:3000/states/country/669f48af48786a4ad3f258d1
router.get('/country/:countryId', async (req, res) => {
  try {
    const states = await State.find({ country_id: req.params.countryId });
    if (states.length === 0) {
      return res.status(404).json({ message: 'No states found for this country' });
    } 
    const states1 = await State.find({ country_id: req.params.countryId }, 'name id latitude longitude');
    res.json(states1);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List all states for a given country name
// http://localhost:3000/states/countryname/Turkey
router.get('/countryname/:countryName', async (req, res) => {
  try {
    const country = await Country.findOne({ name: req.params.countryName });
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }

    const states = await State.find({ country_id: country._id }, 'name id latitude longitude');
    if (states.length === 0) {
      return res.status(404).json({ message: 'No states found for this country' });
    }
    res.json(states);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
