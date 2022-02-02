/* eslint-disable no-unused-expressions */
const sinon = require('sinon');
const { expect } = require('chai');
// Importar o MongoClient e o mock da conexão
const { MongoClient } = require('mongodb');
const {
  describe, before, after, it,
} = require('mocha');
const { getConnection } = require('./mongoMockConnection');

// Importar o model a ser testado
const usersModel = require('../../models/users');

describe('Enconta um usuário pelo CPF', () => {
  let connectionMock;

  const payloadUser = {
    name: 'Cássio Rodrigues Pereira',
    registry: '01512262225',
    password: '1234',
    balance: 0,
  };

  // inserimos o nosso usuário teste para ter seu saldo atualizado
  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
    await connectionMock.db('bank_accounts').collection('accounts').insertOne(payloadUser);
  });

  // Restauraremos a função `connect` original após os testes.
  after(async () => {
    await connectionMock.db('bank_accounts').collection('accounts').drop();
    MongoClient.connect.restore();
  });

  describe('Quando é atualizado com sucesso', () => {
  // Testando se o saldo realmente é atualizado após ser chamada a função `updateBalance`
    it('atualiza a chave "balance"', async () => {
      const { registry } = payloadUser;

      await usersModel.updateBalance(registry, 1000);

      // Usando a função `findByRegisty` para verificar a alteração de saldo
      const { balance } = await usersModel.findByRegistry(registry);

      expect(balance).to.be.eql(1000);
    });
  });
});
