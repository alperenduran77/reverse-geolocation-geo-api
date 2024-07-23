const mongoose = require('mongoose');

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
    latitude: String,
    longitude: String,
    emoji: String,
    emojiU: String,
    timezones: [{
        zoneName: String,
        gmtOffset: Number,
        gmtOffsetName: String,
        abbreviation: String,
        tzName: String,
    }],
    translations: Object,
    states: [{ type: mongoose.Schema.Types.ObjectId, ref: 'State' }]
});

module.exports = mongoose.model('Country', countrySchema);
