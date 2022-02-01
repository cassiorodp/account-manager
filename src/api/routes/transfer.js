const express = require('express');
const { transfer } = require('../../controllers/transfer');

const transferRouter = express.Router();

transferRouter.post('/', transfer);

module.exports = transferRouter;
