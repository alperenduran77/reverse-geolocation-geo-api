const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  state_code: { type: String, required: true },
  latitude: String,
  longitude: String,
  country_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
  cities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'City' }]
}, { collection: 'states' });

module.exports = mongoose.model('State', stateSchema);
