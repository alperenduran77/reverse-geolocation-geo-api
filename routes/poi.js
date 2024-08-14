const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY;

// Get nearby points of interest
// Example: http://localhost:3000/poi/nearby?latitude=40.7691&longitude=-73.9822
/**
 * @swagger
 * /poi/nearby:
 *   get:
 *     summary: Get nearby points of interest
 *     description: Retrieve a list of nearby points of interest based on the given latitude and longitude.
 *     parameters:
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         required: true
 *         description: Latitude of the location
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         required: true
 *         description: Longitude of the location
 *     responses:
 *       200:
 *         description: A list of nearby points of interest
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Name of the point of interest
 *                   phone:
 *                     type: string
 *                     description: Phone number of the point of interest
 *                   categories:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Categories of the point of interest
 *                   address:
 *                     type: string
 *                     description: Address of the point of interest
 *       400:
 *         description: Latitude and longitude are required
 *       500:
 *         description: Internal server error
 */
router.get('/nearby', async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and longitude are required.' });
  }

  const url = `https://api.tomtom.com/search/2/nearbySearch/.json?lat=${latitude}&lon=${longitude}&key=${TOMTOM_API_KEY}`;

  try {
    const response = await axios.get(url);

    // Map through the response and filter the required fields
    const formattedResponse = response.data.results.map(result => ({
      name: result.poi.name,
      phone: result.poi.phone,
      categories: result.poi.categories,
      address: result.address.freeformAddress,
    }));

    res.json(formattedResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
