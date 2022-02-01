const express = require('express');
const validateJWT = require('../../auth/validateJWT');
const { deposit } = require('../../controllers/deposit');

const depositRouter = express.Router();

depositRouter.post('/', validateJWT, deposit);

module.exports = depositRouter;
