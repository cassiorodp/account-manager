const Joi = require('joi');
const usersModel = require('../models/users');
const { badRequest } = require('../utils/dictionary');
const errorConstructor = require('../utils/errorConstructor');

// validação das entradas
const usersSchema = Joi.object({
  userAccount: Joi.string().required(),
  value: Joi.number().max(2000).required(),
});

// transferencia para outro usuário
const deposit = async (userAccount, value) => {
  const { error } = usersSchema.validate({
    userAccount, value,
  });

  // validar entradas incorretas
  if (error) throw errorConstructor(badRequest, error.message);

  // depositar valor
  await usersModel.updateBalance(userAccount, value);

  // conta com valores atualizados
  const { balance: updatedBalance, name } = await usersModel.findByRegistry(userAccount);

  // retornar saldo atualizado
  return { updatedBalance, name };
};

module.exports = {
  deposit,
};
