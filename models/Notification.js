const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  location: {
    latitude: Number,
    longitude: Number,
  },
  radius: { type: Number, required: true },
  geofence: { type: mongoose.Schema.Types.ObjectId, ref: 'Geofence' }, // Reference to Geofence
});

module.exports = mongoose.model('Notification', notificationSchema);
