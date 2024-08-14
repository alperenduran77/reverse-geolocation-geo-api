const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Reverse Geolocation API',
      version: '1.0.0',
      description: 'API documentation for the Reverse Geolocation service',
    },
    servers: [
      {
        url: 'http://3.92.222.167:3000', // Your public server URL
        description: 'API server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Ensure this path matches your file structure
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const swaggerRouter = express.Router();

swaggerRouter.use('/', swaggerUi.serve);
swaggerRouter.get('/', swaggerUi.setup(swaggerDocs, { explorer: true }));

module.exports = swaggerRouter;
