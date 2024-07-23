const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  iso3: { type: String, required: true },
  iso2: { type: String, required: true },
  numeric_code: { type: String, required: true },
  phone_code: { type: String, required: true },
  capital: { type: String, required: true },
  currency: { type: String, required: true },
  currency_name: { type: String, required: true },
  currency_symbol: { type: String, required: true },
  tld: { type: String, required: true },
  native: { type: String, required: true },
  region: { type: String, required: true },
  region_id: { type: String, required: true },
  subregion: { type: String, required: true },
  subregion_id: { type: String, required: true },
  nationality: { type: String, required: true },
  timezones: [{ 
    zoneName: String, 
    gmtOffset: Number, 
    gmtOffsetName: String, 
    abbreviation: String, 
    tzName: String 
  }],
  translations: {
    kr: String,
    pt_BR: String,
    pt: String,
    nl: String,
    hr: String,
    fa: String,
    de: String,
    es: String,
    fr: String,
    ja: String,
    it: String,
    cn: String,
    tr: String,
  },
  latitude: String,
  longitude: String,
  emoji: String,
  emojiU: String,
}, { collection: 'countries' });

module.exports = mongoose.model('Country', countrySchema);
