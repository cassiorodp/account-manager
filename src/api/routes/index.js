const express = require('express');
const usersRouter = require('./users');
const loginRouter = require('./login');

const router = express.Router();

router.use('/users', usersRouter);
router.use('/login', loginRouter);

module.exports = router;
