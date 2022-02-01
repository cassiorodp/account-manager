const express = require('express');
const { createUser } = require('../../controllers/users');

const usersRouter = express.Router();

usersRouter.post('/', createUser);

module.exports = usersRouter;
