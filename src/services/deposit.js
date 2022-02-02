const Joi = require('joi');
const usersModel = require('../models/users');
const { badRequest } = require('../utils/dictionary');
const errorConstructor = require('../utils/errorConstructor');

// validação das entradas
const usersSchema = Joi.object({
  userAccount: Joi.string().required(),
  value: Joi.number().min(1).max(2000).required(),
});

// transferencia para outro usuário
const deposit = async (userAccount, value) => {
  const { error } = usersSchema.validate({
    userAccount, value,
  });

  // validar entradas incorretas
  if (error) throw errorConstructor(badRequest, error.message);

  // depositar valor e retornar valores atualizados
  const { balance: updatedBalance, name } = await usersModel.updateBalance(userAccount, value);

  // retornar saldo atualizado
  return { updatedBalance, name };
};

module.exports = {
  deposit,
};
