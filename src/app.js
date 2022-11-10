const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const contractRoutes = require( './routes/contract');
const jobRoutes = require( './routes/job');
const adminRoutes = require( './routes/admin');
const balanceRoutes = require( './routes/balance');

const app = express();

// midlewares
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)
app.use(
  '/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);

// Routes
app.use('/contracts', contractRoutes);
app.use('/jobs', jobRoutes);
app.use('/admin', adminRoutes);
app.use('/balances', balanceRoutes);

module.exports = app;
