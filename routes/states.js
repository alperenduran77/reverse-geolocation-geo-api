const express = require('express');
const router = express.Router();
const Country = require('../models/Country');
const State = require('../models/State');

// List all states
router.get('/', async (req, res) => {
  try {
    const states = await State.find();
    res.json(states);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
);
// Get state by ID
// http://localhost:3000/states/669f48d748786a4ad3f52630
router.get('/:stateId', async (req, res) => {
  try {
    const state = await State.findById(req.params.stateId);
    if (!state) {
      return res.status(404).json({ message: 'State not found' });
    }
    res.json(state);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
);  

// List all states for a given country ID
// http://localhost:3000/states/country/669f48af48786a4ad3f258d1
router.get('/country/:countryId', async (req, res) => {
  try {
    const states = await State.find({ country_id: req.params.countryId });
    if (states.length === 0) {
      return res.status(404).json({ message: 'No states found for this country' });
    }
    res.json(states);
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

    const states = await State.find({ country_id: country._id });
    if (states.length === 0) {
      return res.status(404).json({ message: 'No states found for this country' });
    }
    res.json(states);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
