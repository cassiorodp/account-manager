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

describe('Cria um novo usuário', () => {
  let connectionMock;

  const payloadUser = {
    name: 'Cássio Rodrigues Pereira',
    registry: '01512262225',
    password: '1234',
    balance: 0,
  };

  // Aqui atualizamos o código para usar o banco montado pela lib `mongo-memory-server`
  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  // Restauraremos a função `connect` original após os testes.
  after(async () => {
    await connectionMock.db('bank_accounts').collection('accounts').drop();
    MongoClient.connect.restore();
  });

  describe('quando é inserido com sucesso', () => {
    it('retorna um objeto', async () => {
      const {
        name, registry, password, balance,
      } = payloadUser;
      const response = await usersModel.create(name, registry, password, balance);

      expect(response).to.be.a('object');
    });
    // Testando se o usuário foi cadastrado após chamar a função `create`.
    it('deve existir um usuário cadastrado!', async () => {
      const {
        name, registry, password, balance,
      } = payloadUser;
      await usersModel.create(name, registry, password, balance);
      const user = await connectionMock
        .db('bank_accounts')
        .collection('accounts')
        .find({ registry });

      expect(user).to.be.not.null;
    });
  });
});
