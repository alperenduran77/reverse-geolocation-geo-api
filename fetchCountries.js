const axios = require('axios');
const mongoose = require('mongoose');
const Country = require('./models/Country');

const API_URL = 'https://restcountries.com/v3.1/all';

async function fetchAndSaveCountries() {
  try {
    // Fetch data from the API
    const response = await axios.get(API_URL);
    const countries = response.data;

    // Map through countries and extract necessary data
    const countriesData = countries.map(country => ({
      name: country.name.common,
      lat: country.latlng[0], // Latitude
      lon: country.latlng[1], // Longitude
      polygons: [] // You can adjust this based on your data needs
    }));

    // Connect to MongoDB
    const MONGODB_URI = 'mongodb://localhost:27017/your-database-name';
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Insert countries data into MongoDB
    await Country.insertMany(countriesData);

    console.log('Countries data successfully saved to MongoDB.');
    mongoose.connection.close(); // Close connection after saving data
  } catch (error) {
    console.error('Error fetching or saving countries data:', error.message);
  }
}

fetchAndSaveCountries();
