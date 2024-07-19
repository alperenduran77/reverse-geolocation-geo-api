// importCities.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const City = require('./models/City');

const MONGODB_URI = 'mongodb://localhost:27017/your-database-name'; // Replace with your MongoDB URI
const JSON_FILE_PATH = path.join(__dirname, 'cities.json'); // Path to your JSON file

async function importCities() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    const fileData = fs.readFileSync(JSON_FILE_PATH, 'utf8');
    const cities = JSON.parse(fileData);

    // Convert lat and lng to numbers
    const formattedCities = cities.map(city => ({
      name: city.name,
      country: city.country,
      lat: parseFloat(city.lat),
      lon: parseFloat(city.lng)
    }));

    await City.insertMany(formattedCities);
    console.log('Cities data successfully imported to MongoDB.');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error importing cities data:', error);
    mongoose.connection.close();
  }
}

importCities();
