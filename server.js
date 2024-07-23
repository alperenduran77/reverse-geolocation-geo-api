require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const countryRoutes = require('./routes/countries');
const searchRoutes = require('./routes/search');
const cityRoutes = require('./routes/cities');
const stateRoutes = require('./routes/states');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/API_database';

mongoose.connect(MONGODB_URI, { })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

app.use(express.json()); // Middleware to parse JSON

app.use('/countries', countryRoutes);
app.use('/search', searchRoutes);
app.use('/cities', cityRoutes);
app.use('/states', stateRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
