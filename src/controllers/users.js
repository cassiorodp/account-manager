const usersService = require('../services/users');
const { created } = require('../utils/dictionary');

const createUser = async (req, res, next) => {
  try {
    const {
      name, registry, password, balance,
    } = req.body;

    const newUser = await usersService.create(name, registry, password, balance);

    return res.status(created).json(newUser);
  } catch (error) {
    console.log(`Create User -> ${error.message}`);
    next(error);
  }
};

module.exports = {
  createUser,
};
