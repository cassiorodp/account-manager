const express = require('express');
const usersRouter = require('./users');
const loginRouter = require('./login');
const transferRouter = require('./transfer');
const depositRouter = require('./deposit');

const router = express.Router();

router.use('/users', usersRouter);
router.use('/login', loginRouter);
router.use('/deposit', depositRouter);
router.use('/transfer', transferRouter);

module.exports = router;
