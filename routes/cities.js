const express = require('express');
const router = express.Router();
const City = require('../models/City');
const State = require('../models/State');

// Get all cities
// http://localhost:3000/cities
/**
 * @swagger
 * /cities:
 *   get:
 *     summary: Get all cities
 *     description: Retrieve a list of all cities with their name, ID, latitude, longitude, and state ID.
 *     responses:
 *       200:
 *         description: A list of cities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   _id:
 *                     type: string
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *                   state_id:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
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
/**
 * @swagger
 * /cities/{cityId}:
 *   get:
 *     summary: Get city by ID
 *     description: Retrieve a specific city by its ID.
 *     parameters:
 *       - in: path
 *         name: cityId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the city to retrieve
 *     responses:
 *       200:
 *         description: A specific city
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 _id:
 *                   type: string
 *                 latitude:
 *                   type: number
 *                 longitude:
 *                   type: number
 *                 state_id:
 *                   type: string
 *       404:
 *         description: City not found
 *       500:
 *         description: Internal server error
 */

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
/**
 * @swagger
 * /cities/state/{stateId}:
 *   get:
 *     summary: Get all cities by state ID
 *     description: Retrieve a list of all cities for a given state ID.
 *     parameters:
 *       - in: path
 *         name: stateId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the state whose cities are to be retrieved
 *     responses:
 *       200:
 *         description: A list of cities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   _id:
 *                     type: string
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *                   state_id:
 *                     type: string
 *       404:
 *         description: No cities found for this state
 *       500:
 *         description: Internal server error
 */
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
/**
 * @swagger
 * /cities/statename/{stateName}:
 *   get:
 *     summary: Get all cities by state name
 *     description: Retrieve a list of all cities for a given state name.
 *     parameters:
 *       - in: path
 *         name: stateName
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the state whose cities are to be retrieved
 *     responses:
 *       200:
 *         description: A list of cities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   _id:
 *                     type: string
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *                   state_id:
 *                     type: string
 *       404:
 *         description: No cities found for this state
 *       500:
 *         description: Internal server error
 */
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
