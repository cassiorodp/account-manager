const Joi = require('joi');
const usersModel = require('../models/users');
const { badRequest, conflict } = require('../utils/dictionary');
const errorConstructor = require('../utils/errorConstructor');

// validação das entradas
const usersSchema = Joi.object({
  userAccount: Joi.string().required(),
  transferAccount: Joi.string().required(),
  value: Joi.number().min(1).required(),
});

// transferencia para outro usuário
const transfer = async (userAccount, transferAccount, value) => {
  const { error } = usersSchema.validate({
    userAccount, transferAccount, value,
  });

  if (error) throw errorConstructor(badRequest, error.message);

  // verificar saldo
  const { balance } = await usersModel.findByRegistry(userAccount);

  // verificar possibilidade de transferencia
  if (value > balance) throw errorConstructor(conflict, 'insufficient balance');

  // debitar valor a ser transferido da conta atual
  const { balance: updatedBalance, name } = await usersModel.updateBalance(userAccount, -value);

  // transferir valor para a conta escolhida
  await usersModel.updateBalance(transferAccount, value);

  // retornar saldo atualizado
  return { updatedBalance, name };
};

module.exports = {
  transfer,
};
