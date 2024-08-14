const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();
const formatRoute = require('../utils/formatRoute');
const getCoordinatesFromDB = require('../utils/getCoordinatesFromDB');

const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY;

// Example: http://localhost:3000/geolocation/route?start=Başiskele&end=Ankara
/**
 * @swagger
 * /geolocation/route:
 *   get:
 *     summary: Calculate route between two locations
 *     description: Retrieve a route between two locations based on their names.
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the start location
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the end location
 *     responses:
 *       200:
 *         description: A formatted route between the two locations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: string
 *                   description: Summary of the route
 *                 distance:
 *                   type: number
 *                   description: Distance of the route in meters
 *                 travelTime:
 *                   type: number
 *                   description: Travel time in seconds
 *                 steps:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       instruction:
 *                         type: string
 *                         description: Driving instruction
 *                       distance:
 *                         type: number
 *                         description: Distance of the step in meters
 *                       duration:
 *                         type: number
 *                         description: Duration of the step in seconds
 *       400:
 *         description: Start and end locations are required
 *       404:
 *         description: No coordinates found for the given location
 *       500:
 *         description: Internal server error
 */
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
