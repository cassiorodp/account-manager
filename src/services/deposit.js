const Joi = require('joi');
const usersModel = require('../models/users');
const { badRequest, forbidden } = require('../utils/dictionary');
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

  // validar deposito acima de 2000
  if (error.message.startsWith('"value"')) throw errorConstructor(forbidden, error.message);
  // validar entradas incorretas
  if (error) throw errorConstructor(badRequest, 'Invalid entries. Try again.');

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
