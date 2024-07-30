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
      country = await Country.findOne(query, 'name _id latitude longitude');
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
        state = await State.findOne(query, 'name _id latitude longitude');
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
          city = await City.findOne(query, 'name _id latitude longitude');
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
      country = await Country.findOne(query, 'name _id latitude longitude'); // Select only name and _id fields
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
      state = await State.findOne(query, 'name _id latitude longitude'); // Select only name and _id fields
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
      city = await City.findOne(query, 'name _id latitude longitude'); // Select only name and _id fields
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
