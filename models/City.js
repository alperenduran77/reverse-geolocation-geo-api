// models/City.js
const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: String,
  latitude: String,
  longitude: String,
  state_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State'
  }
});

module.exports = mongoose.model('City', citySchema);
