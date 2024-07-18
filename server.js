const express = require('express');
const mongoose = require('mongoose');
const Country = require('./models/Country');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/your-database-name';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/search/country', async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: 'Country name is required' });
  }

  try {
    const country = await Country.findOne({ name });
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    
    console.log(`Entered Country: ${name}`);
    console.log(`Latitude: ${country.lat}`);
    console.log(`Longitude: ${country.lon}`);

    res.json({ lat: country.lat, lon: country.lon });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
