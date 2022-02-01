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

  // inserimos o nosso usuário teste para ser encontrado pelo metodo do usersModel
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

  describe('Quando é encontrado com sucesso', () => {
    it('retorna um objeto', async () => {
      const { registry } = payloadUser;
      const response = await usersModel.findByRegistry(registry);

      expect(response).to.be.a('object');
    });
    // Testando se o usuário foi encontrado após chamar a função `findByRegistry`.
    it('O objeto deve possuir as seguintes chaves', async () => {
      const { registry } = payloadUser;
      const user = await usersModel.findByRegistry(registry);

      expect(user).to.have.all.keys('_id', 'name', 'registry', 'password', 'balance');
      // expect(user).to.have.property('name');
      // expect(user).to.have.property('registry');
      // expect(user).to.have.property('password');
      // expect(user).to.have.property('balance');
    });
  });

  describe('Quando não é encontrado', () => {
    it('retorna null', async () => {
      const wrongRegistry = '01512264222';
      const response = await usersModel.findByRegistry(wrongRegistry);

      expect(response).to.be.null;
    });
  });
});
