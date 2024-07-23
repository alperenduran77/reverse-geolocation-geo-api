const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    id: Number,
    name: String,
    country_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
    cities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'City' }]
});

module.exports = mongoose.model('State', stateSchema);
