const express = require('express');
const router = express.Router();
const Country = require('../models/Country');
const State = require('../models/State');
const City = require('../models/City');

const DELTA = 0.01; // Adjust this delta value to control the proximity range

// General search by name or latitude and longitude
// Example queries:
// http://localhost:3000/search?name=Turkey
// http://localhost:3000/search?latitude=39.00000000&longitude=35.00000000
/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search for a country, state, or city by name or coordinates
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name of the country, state, or city
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         description: Latitude of the location
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         description: Longitude of the location
 *     responses:
 *       200:
 *         description: A country, state, or city object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   example: Country
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     latitude:
 *                       type: number
 *                     longitude:
 *                       type: number
 *       400:
 *         description: Missing required parameters
 *       404:
 *         description: No matching country, state, or city found
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  const { name, latitude, longitude } = req.query;

  if (!name && (!latitude || !longitude)) {
    return res.status(400).json({ message: 'Name or latitude and longitude are required.' });
  }

  try {
    let query = {};

    if (name) {
      query.name = { $regex: `^${name}$`, $options: 'i' }; // Case-insensitive exact match
    }

    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      query.latitude = { $gte: lat - DELTA, $lte: lat + DELTA };
      query.longitude = { $gte: lon - DELTA, $lte: lon + DELTA };
    }

    let result = {};
    // Search for a country
    let country;
    if (latitude && longitude) {
      country = await Country.findOne(query, 'name _id');
    } else if (name) {
      country = await Country.findOne(query, 'latitude longitude _id');
    }

    if (country) {
      result.type = 'Country';
      result.data = {
        id: country._id,
        name: country.name,
        latitude: country.latitude,
        longitude: country.longitude,
      };
    } else {
      // Search for a state
      let state;
      if (latitude && longitude) {
        state = await State.findOne(query, 'name _id');
      } else if (name) {
        state = await State.findOne(query, 'latitude longitude _id');
      }

      if (state) {
        result.type = 'State';
        result.data = {
          id: state._id,
          name: state.name,
          latitude: state.latitude,
          longitude: state.longitude,
        };
      } else {
        // Search for a city
        let city;
        if (latitude && longitude) {
          city = await City.findOne(query, 'name _id');
        } else if (name) {
          city = await City.findOne(query, 'latitude longitude _id');
        }

        if (city) {
          result.type = 'City';
          result.data = {
            id: city._id,
            name: city.name,
            latitude: city.latitude,
            longitude: city.longitude,
          };
        } else {
          return res.status(404).json({ message: 'No matching country, state, or city found.' });
        }
      }
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search country by name or latitude and longitude
// http://localhost:3000/search/countries?name=Turkey
// http://localhost:3000/search/countries?latitude=39.00000000&longitude=35.00000000
/**
 * @swagger
 * /search/countries:
 *   get:
 *     summary: Search for a country by name or coordinates
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name of the country
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         description: Latitude of the country
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         description: Longitude of the country
 *     responses:
 *       200:
 *         description: A country object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 latitude:
 *                   type: number
 *                 longitude:
 *                   type: number
 *       404:
 *         description: No matching country found
 *       500:
 *         description: Internal server error
 */
router.get('/countries', async (req, res) => {
  const { name, latitude, longitude } = req.query;

  try {
    let query = {};

    if (name) {
      query.name = { $regex: `^${name}$`, $options: 'i' }; // Case-insensitive exact match
    }

    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      query.latitude = { $gte: lat - DELTA, $lte: lat + DELTA };
      query.longitude = { $gte: lon - DELTA, $lte: lon + DELTA };
    }

    let country;
    if (latitude && longitude) {
      country = await Country.findOne(query, 'name _id'); // Select only name and _id fields
    } else if (name) {
      country = await Country.findOne(query, 'latitude longitude _id'); // Select latitude, longitude, and _id fields
    }

    if (!country) {
      return res.status(404).json({ message: 'No countries found matching the criteria.' });
    }

    const result = {
      id: country._id,
      name: country.name,
      latitude: country.latitude,
      longitude: country.longitude,
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search state by name or latitude and longitude
// http://localhost:3000/search/states?name=Kocaeli
// http://localhost:3000/search/states?latitude=40.85327040&longitude=29.88152030
/**
 * @swagger
 * /search/states:
 *   get:
 *     summary: Search for a state by name or coordinates
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name of the state
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         description: Latitude of the state
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         description: Longitude of the state
 *     responses:
 *       200:
 *         description: A state object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 latitude:
 *                   type: number
 *                 longitude:
 *                   type: number
 *       404:
 *         description: No matching state found
 *       500:
 *         description: Internal server error
 */
router.get('/states', async (req, res) => {
  const { name, latitude, longitude } = req.query;

  try {
    let query = {};

    if (name) {
      query.name = { $regex: `^${name}$`, $options: 'i' }; // Case-insensitive exact match
    }

    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      query.latitude = { $gte: lat - DELTA, $lte: lat + DELTA };
      query.longitude = { $gte: lon - DELTA, $lte: lon + DELTA };
    }

    let state;
    if (latitude && longitude) {
      state = await State.findOne(query, 'name _id'); // Select only name and _id fields
    } else if (name) {
      state = await State.findOne(query, 'latitude longitude _id'); // Select latitude, longitude, and _id fields
    }

    if (!state) {
      return res.status(404).json({ message: 'No states found matching the criteria.' });
    }

    const result = {
      id: state._id,
      name: state.name,
      latitude: state.latitude,
      longitude: state.longitude,
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search city by name or latitude and longitude
// http://localhost:3000/search/cities?latitude=40.64574000&longitude=29.90015000
// http://localhost:3000/search/cities?name=Başiskele
/**
 * @swagger
 * /search/cities:
 *   get:
 *     summary: Search for a city by name or coordinates
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name of the city
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         description: Latitude of the city
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         description: Longitude of the city
 *     responses:
 *       200:
 *         description: A city object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 latitude:
 *                   type: number
 *                 longitude:
 *                   type: number
 *       404:
 *         description: No matching city found
 *       500:
 *         description: Internal server error
 */
router.get('/cities', async (req, res) => {
  const { name, latitude, longitude } = req.query;

  try {
    let query = {};

    if (name) {
      query.name = { $regex: `^${name}$`, $options: 'i' }; // Case-insensitive exact match
    }

    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      query.latitude = { $gte: lat - DELTA, $lte: lat + DELTA };
      query.longitude = { $gte: lon - DELTA, $lte: lon + DELTA };
    }

    let city;
    if (latitude && longitude) {
      city = await City.findOne(query, 'name _id'); // Select only name and _id fields
    } else if (name) {
      city = await City.findOne(query, 'latitude longitude _id'); // Select latitude, longitude, and _id fields
    }

    if (!city) {
      return res.status(404).json({ message: 'No cities found matching the criteria.' });
    }

    const result = {
      id: city._id,
      name: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
