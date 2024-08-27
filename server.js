const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const countryRoutes = require('./routes/countries');
const searchRoutes = require('./routes/search');
const cityRoutes = require('./routes/cities');
const stateRoutes = require('./routes/states');
const geolocationRoutes = require('./routes/geolocation');
const geofenceRoutes = require('./routes/geofencing');
const notificationRoutes = require('./routes/notifications');
const poiRoutes = require('./routes/poi');
const nearestLocationRoutes = require('./routes/nearestLocation');
const swaggerRouter = require('./swagger');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/API_database';

// MongoDB connection
mongoose.connect(MONGODB_URI, {})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// CORS configuration
const corsOptions = {
  origin: 'http://54.173.178.224:3000', // Swagger UI URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // If needed for authentication
};

app.use(cors(corsOptions));
app.use(express.json()); // Middleware to parse JSON

// Route configuration
app.use('/countries', countryRoutes);
app.use('/search', searchRoutes);
app.use('/cities', cityRoutes);
app.use('/states', stateRoutes);
app.use('/geolocation', geolocationRoutes);
app.use('/geofence', geofenceRoutes);
app.use('/notifications', notificationRoutes);
app.use('/poi', poiRoutes);
app.use('/nearestLocation', nearestLocationRoutes);
app.use('/swagger', swaggerRouter);

// Redirect HTTP requests from port 80 to Swagger documentation
app.get('/', (req, res) => {
  res.redirect('http://54.173.178.224:3000/swagger');
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
