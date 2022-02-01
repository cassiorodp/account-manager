const bodyParser = require('body-parser');
const express = require('express');
const router = require('./routes');
const errorHandler = require('../middlewares/errorHandler');

const app = express();

app.use(bodyParser.json());
app.use(router);
app.use(errorHandler);

module.exports = app;
