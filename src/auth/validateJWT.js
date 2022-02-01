const jwt = require('jsonwebtoken');
const usersModel = require('../models/users');
const { unauthorized } = require('../utils/dictionary');
require('dotenv').config();

const secret = process.env.SECRET;

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(unauthorized).json({ message: 'missing auth token' });
  }

  try {
    const decoded = jwt.verify(token, secret);

    const user = await usersModel.findByRegistry(decoded.data.registry);

    if (!user) {
      return res
        .status(unauthorized)
        .json({ message: 'User not found.' });
    }

    req.user = user;

    next();
    return null;
  } catch (error) {
    return res.status(unauthorized).json({ message: error.message });
  }
};
