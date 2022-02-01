const express = require('express');
const validateJWT = require('../../auth/validateJWT');
const { transfer } = require('../../controllers/transfer');

const transferRouter = express.Router();

transferRouter.post('/', validateJWT, transfer);

module.exports = transferRouter;
