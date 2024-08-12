const fs = require('fs');
const mongoose = require('mongoose');
const Country = require('./models/Country');
const State = require('./models/State');
const City = require('./models/City');

const importData = async () => {
  try {
    const data = JSON.parse(fs.readFileSync('./countries+states+cities.json', 'utf-8'));

    for (const countryData of data) {
      const states = [];

      const country = new Country({
        name: countryData.name,
        iso2: countryData.iso2,
        iso3: countryData.iso3,
        numeric_code: countryData.numeric_code,
        phone_code: countryData.phone_code,
        capital: countryData.capital,
        currency: countryData.currency,
        currency_name: countryData.currency_name,
        currency_symbol: countryData.currency_symbol,
        tld: countryData.tld,
        native: countryData.native,
        region: countryData.region,
        region_id: countryData.region_id,
        subregion: countryData.subregion,
        subregion_id: countryData.subregion_id,
        nationality: countryData.nationality,
        timezones: countryData.timezones,
        translations: countryData.translations,
        latitude: countryData.latitude,
        longitude: countryData.longitude,
        emoji: countryData.emoji,
        emojiU: countryData.emojiU,
        states: []
      });
      await country.save();

      for (const stateData of countryData.states) {
        const state = new State({
          name: stateData.name,
          state_code: stateData.state_code,
          latitude: stateData.latitude,
          longitude: stateData.longitude,
          country_id: country._id,
          cities: []
        });
        await state.save();

        for (const cityData of stateData.cities) {
          const city = new City({
            name: cityData.name,
            latitude: cityData.latitude,
            longitude: cityData.longitude,
            state_id: state._id
          });
          await city.save();
          state.cities.push(city._id);
        }

        await state.save();
        states.push(state._id);
      }

      country.states = states;
      await country.save();
    }
    console.log('Data imported successfully');
  } catch (error) {
    console.error('Error importing data:', error);
  }
};

mongoose.connect('mongodb://localhost:27017/API_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  importData().then(() => {
    mongoose.disconnect();
  }).catch((err) => {
    console.error('Error during import:', err);
    mongoose.disconnect();
  });
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});
