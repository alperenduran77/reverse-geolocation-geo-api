const express = require('express');
const router = express.Router();
const Geofence = require('../models/Geofence'); // Assuming you have a Geofence model

// Define a new geofence
router.post('/', async (req, res) => {
  const { name, coordinates, radius } = req.body;
  if (!name || !coordinates || !radius) {
    return res.status(400).json({ message: 'Name, coordinates, and radius are required.' });
  }
  const geofence = new Geofence({ name, coordinates, radius });
  try {
    const savedGeofence = await geofence.save();
    res.status(201).json(savedGeofence);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Check if a point is inside a geofence
router.post('/check', async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and longitude are required.' });
  }

  try {
    const geofences = await Geofence.find();
    const insideGeofences = geofences.filter(geofence => {
      const distance = HaversineFormula(latitude, longitude, geofence.coordinates.latitude, geofence.coordinates.longitude);
      return distance <= geofence.radius;
    });

    res.json(insideGeofences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const HaversineFormula = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Update a geofence
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, coordinates, radius } = req.body;
  try {
    const updatedGeofence = await Geofence.findByIdAndUpdate(id, { name, coordinates, radius }, { new: true });
    res.json(updatedGeofence);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a geofence
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Geofence.findByIdAndDelete(id);
    res.json({ message: 'Geofence deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
