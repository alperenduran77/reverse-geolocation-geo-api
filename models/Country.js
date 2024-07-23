const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  id: Number,
  name: String,
  state_code: String,
  latitude: String,
  longitude: String,
  type: String,
  cities: [
    {
      id: Number,
      name: String,
      latitude: String,
      longitude: String
    }
  ]
});

const countrySchema = new mongoose.Schema({
  id: Number,
  name: String,
  iso3: String,
  iso2: String,
  numeric_code: String,
  phone_code: String,
  capital: String,
  currency: String,
  currency_name: String,
  currency_symbol: String,
  tld: String,
  native: String,
  region: String,
  region_id: String,
  subregion: String,
  subregion_id: String,
  nationality: String,
  timezones: [
    {
      zoneName: String,
      gmtOffset: Number,
      gmtOffsetName: String,
      abbreviation: String,
      tzName: String
    }
  ],
  translations: {
    kr: String,
    'pt-BR': String,
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
    tr: String
  },
  latitude: String,
  longitude: String,
  emoji: String,
  emojiU: String,
  states: [stateSchema]
});

module.exports = mongoose.model('Country', countrySchema);
