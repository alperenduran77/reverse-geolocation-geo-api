const express = require('express');
const mongoose = require('mongoose');
const countryRoutes = require('./routes/countries');
const searchRoutes = require('./routes/search');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/your-database-name';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/countries', countryRoutes);
app.use('/search/country', searchRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
