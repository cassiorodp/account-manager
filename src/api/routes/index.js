const express = require('express');
const loginRouter = require('./login');
const usersRouter = require('./users');

const router = express.Router();

router.use('/users', usersRouter);
router.use('/login', loginRouter);

module.exports = router;
