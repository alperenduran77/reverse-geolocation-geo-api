const https = require('https');
const mongoose = require('mongoose');
const City = require('./models/City');

const API_KEY = '5ab38849eemsh980f84cd5674ae6p1c2324jsn81216aff3392';
const API_HOST = 'wft-geo-db.p.rapidapi.com';
const BASE_PATH = '/v1/geo/cities';

const MONGODB_URI = 'mongodb://localhost:27017/your-database-name'; // Replace with your MongoDB URI

async function fetchCities(page, limit) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: API_HOST,
      port: null,
      path: `${BASE_PATH}?offset=${page * limit}&limit=${limit}`,
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST
      }
    };

    const req = https.request(options, function (res) {
      const chunks = [];

      res.on('data', function (chunk) {
        chunks.push(chunk);
      });

      res.on('end', function () {
        const body = Buffer.concat(chunks);
        const response = JSON.parse(body.toString());

        if (response.data) {
          resolve(response.data);
        } else {
          reject(response.errors || 'Unknown error');
        }
      });
    });

    req.on('error', (e) => {
      reject(e.message);
    });

    req.end();
  });
}

async function fetchAndSaveCities() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    const limit = 1; // Fetch 1000 cities at a time
    let page = 0;
    let citiesFetched;

    do {
      citiesFetched = await fetchCities(page, limit);
      if (citiesFetched.length > 0) {
        const citiesData = citiesFetched.map(city => ({
          name: city.city,
          country: city.country,
          lat: city.latitude,
          lon: city.longitude
        }));

        await City.insertMany(citiesData);
        console.log(`Page ${page} - ${citiesFetched.length} cities saved to MongoDB.`);
        page++;
      }
    } while (citiesFetched.length === limit);

    console.log('All cities data successfully saved to MongoDB.');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error fetching or saving cities data:', error);
    mongoose.connection.close();
  }
}

fetchAndSaveCities();
