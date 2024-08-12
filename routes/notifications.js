const express = require('express');
const router = express.Router();
const Geofence = require('../models/Geofence');
const Notification = require('../models/Notification');

// Create a new notification
router.post('/', async (req, res) => {
  const { message, geofence } = req.body;

  if (!message || !geofence) {
    return res.status(400).json({ message: 'Message and geofence ID are required.' });
  }

  try {
    const geofenceData = await Geofence.findById(geofence);
    
    if (!geofenceData) {
      return res.status(404).json({ message: 'Geofence not found.' });
    }

    const notification = new Notification({
      message,
      location: geofenceData.coordinates,
      radius: geofenceData.radius,
      geofence: geofenceData._id
    });

    const savedNotification = await notification.save();
    res.status(201).json(savedNotification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Check if a point is inside any geofence and send relevant notifications
router.post('/check-and-notify', async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and longitude are required.' });
  }

  try {
    const geofences = await Geofence.find();
    const triggeredNotifications = [];

    // Check each geofence
    for (const geofence of geofences) {
      const distance = calculateDistance(latitude, longitude, geofence.coordinates.latitude, geofence.coordinates.longitude);

      if (distance <= geofence.radius) {
        // Find notifications associated with this geofence
        const notifications = await Notification.find({ geofence: geofence._id });

        notifications.forEach(notification => {
          console.log(`Sending notification: ${notification.message}`);
          triggeredNotifications.push(notification);
        });
      }
    }

    res.json(triggeredNotifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const calculateDistance = (lat1, lon1, lat2, lon2) => {
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

module.exports = router;
