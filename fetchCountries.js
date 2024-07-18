const axios = require('axios');
const mongoose = require('mongoose');
const Country = require('./models/Country');

const API_URL = 'https://restcountries.com/v3.1/all';

async function fetchAndSaveCountries() {
  try {
    
    const response = await axios.get(API_URL);
    const countries = response.data;

    
    const countriesData = countries.map(country => ({
      name: country.name.common,
      lat: country.latlng[0], 
      lon: country.latlng[1], 
      polygons: [] 
    }));


    const MONGODB_URI = 'mongodb://localhost:27017/your-database-name';
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    
    await Country.insertMany(countriesData);

    console.log('Countries data successfully saved to MongoDB.');
    mongoose.connection.close(); 
  } catch (error) {
    console.error('Error fetching or saving countries data:', error.message);
  }
}

fetchAndSaveCountries();
