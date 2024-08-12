const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();
const formatRoute = require('../utils/formatRoute');
const getCoordinatesFromDB = require('../utils/getCoordinatesFromDB');

const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY;

// Example: http://localhost:3000/geolocation/route?start=Başiskele&end=Ankara
router.get('/route', async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ message: 'Start and end locations are required.' });
  }

  try {
    //console.log(`Original Start location: ${start}`);
    //console.log(`Original End location: ${end}`);

    const startCoords = await getCoordinatesFromDB(start);
    //console.log(`Start coordinates: ${startCoords ? `${startCoords.latitude}, ${startCoords.longitude}` : 'not found'}`);
    
    const endCoords = await getCoordinatesFromDB(end);
    //console.log(`End coordinates: ${endCoords ? `${endCoords.latitude}, ${endCoords.longitude}` : 'not found'}`);

    if (!startCoords || !endCoords) {
      return res.status(404).json({ message: `No coordinates found for the location: ${!startCoords ? start : end}` });
    }

    const url = `https://api.tomtom.com/routing/1/calculateRoute/${startCoords.latitude},${startCoords.longitude}:${endCoords.latitude},${endCoords.longitude}/json?key=${TOMTOM_API_KEY}`;
    //console.log(`TomTom API URL: ${url}`);

    const response = await axios.get(url);
    const formattedData = formatRoute(response.data);
    res.json(formattedData);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
