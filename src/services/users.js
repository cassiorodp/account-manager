const Joi = require('joi');
const usersModel = require('../models/users');
const { badRequest, conflict } = require('../utils/dictionary');
const errorConstructor = require('../utils/errorConstructor');

// validação das entradas
const usersSchema = Joi.object({
  name: Joi.string().required(),
  registry: Joi.string().length(11).required(),
  password: Joi.string().min(5).required(),
  balance: Joi.number().min(0),
});

// Criar usuário
const create = async (name, registry, password, balance = 0) => {
  const { error } = usersSchema.validate({
    name, registry, password, balance,
  });

  if (error) throw errorConstructor(badRequest, 'Invalid entries. Try again.');

  // validar caso usuário já registrado
  const foundUser = await usersModel.findByRegistry(registry);

  if (foundUser) throw errorConstructor(conflict, 'CPF already registered');

  const id = await usersModel.create(name, registry, password, balance);

  const user = {
    _id: id,
    name,
    registry,
    balance,
  };

  return { user };
};

module.exports = {
  create,
};
