const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const router = require('./routes/router');
app.use('/', router);

const cors = require('cors');
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || '*',
    credentials: true,
}));

const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./docs/openapi.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

module.exports = app;
