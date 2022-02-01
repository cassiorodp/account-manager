const Joi = require('joi');
const usersModel = require('../models/users');
const { unauthorized } = require('../utils/dictionary');
const errorConstructor = require('../utils/errorConstructor');

const loginSchema = Joi.object({
  registry: Joi.string().required(),
  password: Joi.string().required(),
});

const login = async (registry, password) => {
  const { error } = loginSchema.validate({ registry, password });

  if (error) throw errorConstructor(unauthorized, 'All fields must be filled');

  const user = await usersModel.findByRegistry(registry);

  if (!user || user.password !== password) {
    throw errorConstructor(unauthorized, 'Incorrect CPF or password');
  }

  return user;
};

module.exports = {
  login,
};
