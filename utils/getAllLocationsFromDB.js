const City = require('../models/City');
const State = require('../models/State');
const Country = require('../models/Country');

const getAllLocationsFromDB = async () => {
    const countries = await Country.find({}).populate({
        path: 'states',
        populate: {
            path: 'cities',
            model: 'City'
        }
    });
    return countries;
};

module.exports = getAllLocationsFromDB;
