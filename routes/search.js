const express = require('express');
const router = express.Router();
const Country = require('../models/Country');
const State = require('../models/State');
const City = require('../models/City');

// Search country by name or latitude and longitude
router.get('/countries', async (req, res) => {
    const { name, latitude, longitude } = req.query;

    try {
        let query = {};

        if (name) {
            query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
        }

        if (latitude && longitude) {
            query.latitude = latitude;
            query.longitude = longitude;
        }

        const countries = await Country.find(query);

        if (countries.length === 0) {
            return res.status(404).json({ message: 'No countries found matching the criteria.' });
        }

        res.json(countries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search state by name or latitude and longitude
router.get('/states', async (req, res) => {
    const { name, latitude, longitude } = req.query;

    try {
        let query = {};

        if (name) {
            query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
        }

        if (latitude && longitude) {
            query.latitude = latitude;
            query.longitude = longitude;
        }

        const states = await State.find(query);

        if (states.length === 0) {
            return res.status(404).json({ message: 'No states found matching the criteria.' });
        }

        res.json(states);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search city by name or latitude and longitude
router.get('/cities', async (req, res) => {
    const { name, latitude, longitude } = req.query;

    try {
        let query = {};

        if (name) {
            query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
        }

        if (latitude && longitude) {
            query.latitude = latitude;
            query.longitude = longitude;
        }

        const cities = await City.find(query);

        if (cities.length === 0) {
            return res.status(404).json({ message: 'No cities found matching the criteria.' });
        }

        res.json(cities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
