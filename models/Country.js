const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  polygons: { type: [[Number]], required: false } // Optional, based on your needs
});

module.exports = mongoose.model('Country', countrySchema);
