const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: String,
  longitude: String,
  state_id: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true }
}, { collection: 'cities' });

module.exports = mongoose.model('City', citySchema);
