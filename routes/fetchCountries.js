const fs = require('fs');
const mongoose = require('mongoose');
const Country = require('../models/Country');
const State = require('../models/State');
const City = require('../models/City');

const importData = async () => {
  const data = JSON.parse(fs.readFileSync('./countries+states+cities.json', 'utf-8'));

  for (const countryData of data) {
    const states = [];

    for (const stateData of countryData.states) {
      const cities = [];

      for (const cityData of stateData.cities) {
        const city = new City({
          name: cityData.name,
          latitude: cityData.latitude,
          longitude: cityData.longitude
        });
        await city.save();
        cities.push(city._id);
      }

      const state = new State({
        name: stateData.name,
        state_code: stateData.state_code,
        latitude: stateData.latitude,
        longitude: stateData.longitude,
        cities: cities
      });
      await state.save();
      states.push(state._id);
    }

    const country = new Country({
      name: countryData.name,
      iso2: countryData.iso2,
      iso3: countryData.iso3,
      phone_code: countryData.phone_code,
      capital: countryData.capital,
      currency: countryData.currency,
      native: countryData.native,
      region: countryData.region,
      subregion: countryData.subregion,
      latitude: countryData.latitude,
      longitude: countryData.longitude,
      emoji: countryData.emoji,
      states: states
    });
    await country.save();
  }
  console.log('Data imported successfully');
};

mongoose.connect('mongodb://localhost:27017/API_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  importData();
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});
