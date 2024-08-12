const express = require('express');
const router = express.Router();
const getAllLocationsFromDB = require('../utils/getAllLocationsFromDB');
const HaversineFormula = require('../utils/HaversineFormula');

// Find the nearest country, state, and city based on latitude and longitude
// http://localhost:3000/nearestLocation/nearest-location?latitude=40.7691&longitude=30.1
router.get('/nearest-location', async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Latitude and longitude are required.' });
    }

    try {
        const locations = await getAllLocationsFromDB();

        let nearestLocation = null;
        let minDistance = Infinity;

        // Iterate over all countries and their states/cities
        locations.forEach(country => {
            country.states.forEach(state => {
                state.cities.forEach(city => {
                    const distance = HaversineFormula(
                        parseFloat(latitude), 
                        parseFloat(longitude), 
                        parseFloat(city.latitude), 
                        parseFloat(city.longitude)
                    );

                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestLocation = {
                            country: country.name,
                            state: state.name,
                            city: city.name,
                            distance: distance
                        };
                    }
                });
            });
        });

        if (nearestLocation) {
            res.json(nearestLocation);
        } else {
            res.status(404).json({ message: 'No locations found.' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
