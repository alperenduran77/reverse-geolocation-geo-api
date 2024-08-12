const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CountrySchema = new Schema({
  name: { type: String, required: false },
  iso2: { type: String, required: false },
  iso3: { type: String, required: false },
  numeric_code: { type: String, required: false },
  phone_code: { type: String, required: false },
  capital: { type: String, required: false }, // Make this field optional
  currency: { type: String, required: false },
  currency_name: { type: String, required: false },
  currency_symbol: { type: String, required: false },
  tld: { type: String, required: false },
  native: { type: String, required: false },
  region: { type: String, required: false },
  region_id: { type: String, required: false },
  subregion: { type: String, required: false }, // Make this field optional
  subregion_id: { type: String, required: false }, // Make this field optional
  nationality: { type: String, required: false },
  timezones: { type: Array, required: false },
  translations: { type: Object, required: false },
  latitude: { type: String, required: false },
  longitude: { type: String, required: false },
  emoji: { type: String, required: false },
  emojiU: { type: String, required: false },
  states: [{ type: mongoose.Schema.Types.ObjectId, ref: 'State' }]
});

module.exports = mongoose.model('Country', CountrySchema);
