const jwt = require('jsonwebtoken');
const loginServices = require('../services/login');
const { success } = require('../utils/dictionary');
require('dotenv').config();

// secret utilizado "hard coded" somente para exemplo local
const secret = process.env.SECRET;

const login = async (req, res, next) => {
  try {
    const { registry, password } = req.body;

    const user = await loginServices.login(registry, password);

    const jwtConfig = {
      expiresIn: '1h',
      algorithm: 'HS256',
    };

    const { password: _password, ...userWithoutPassword } = user;

    const token = jwt.sign({ data: userWithoutPassword }, secret, jwtConfig);

    return res.status(success).json({ token });
  } catch (error) {
    console.error(`Login -> ${error.message}`);
    next(error);
    return null;
  }
};

module.exports = {
  login,
};
