const City = require('../models/City');
const State = require('../models/State');
const Country = require('../models/Country');

const getCoordinatesFromDB = async (location) => {
  let result;

  //console.log(`Searching for city: ${location}`);
  result = await City.findOne({ name: location });
  if (result) {
    //console.log(`Found city: ${result.name}`);
    return { latitude: result.latitude, longitude: result.longitude };
  }

  //console.log(`Searching for state: ${location}`);
  result = await State.findOne({ name: location });
  if (result) {
    //console.log(`Found state: ${result.name}`);
    return { latitude: result.latitude, longitude: result.longitude };
  }

  //console.log(`Searching for country: ${location}`);
  result = await Country.findOne({ name: location });
  if (result) {
    //console.log(`Found country: ${result.name}`);
    return { latitude: result.latitude, longitude: result.longitude };
  }

  throw new Error(`No coordinates found for the location: ${location}`);
};

module.exports = getCoordinatesFromDB;
