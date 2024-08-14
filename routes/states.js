const express = require('express');
const router = express.Router();
const Country = require('../models/Country');
const State = require('../models/State');

// List all states
// http://localhost:3000/states
/**
 * @swagger
 * /states:
 *   get:
 *     summary: List all states
 *     description: Retrieve a list of all states with their name, ID, latitude, longitude, and country ID.
 *     responses:
 *       200:
 *         description: A list of states
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
 *                   country_id:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
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
/**
 * @swagger
 * /states/{stateId}:
 *   get:
 *     summary: Get state by ID
 *     description: Retrieve a specific state by its ID.
 *     parameters:
 *       - in: path
 *         name: stateId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the state to retrieve
 *     responses:
 *       200:
 *         description: A specific state
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
 *                 country_id:
 *                   type: string
 *       404:
 *         description: State not found
 *       500:
 *         description: Internal server error
 */
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
/**
 * @swagger
 * /states/name/{stateName}:
 *   get:
 *     summary: Get state by name
 *     description: Retrieve a specific state by its name.
 *     parameters:
 *       - in: path
 *         name: stateName
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the state to retrieve
 *     responses:
 *       200:
 *         description: A specific state
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
 *                 country_id:
 *                   type: string
 *       404:
 *         description: State not found
 *       500:
 *         description: Internal server error
 */
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
/**
 * @swagger
 * /states/country/{countryId}:
 *   get:
 *     summary: List all states for a given country ID
 *     description: Retrieve a list of all states for a given country ID.
 *     parameters:
 *       - in: path
 *         name: countryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the country whose states are to be retrieved
 *     responses:
 *       200:
 *         description: A list of states
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
 *                   country_id:
 *                     type: string
 *       404:
 *         description: No states found for this country
 *       500:
 *         description: Internal server error
 */
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
/**
 * @swagger
 * /states/countryname/{countryName}:
 *   get:
 *     summary: List all states for a given country name
 *     description: Retrieve a list of all states for a given country name.
 *     parameters:
 *       - in: path
 *         name: countryName
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the country whose states are to be retrieved
 *     responses:
 *       200:
 *         description: A list of states
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
 *                   country_id:
 *                     type: string
 *       404:
 *         description: No states found for this country
 *       500:
 *         description: Internal server error
 */
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
