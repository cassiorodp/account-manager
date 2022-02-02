const sinon = require('sinon');
const { expect } = require('chai');
const {
  describe, before, it, after,
} = require('mocha');
const { MongoClient } = require('mongodb');
const loginService = require('../../services/login');
const { unauthorized } = require('../../utils/dictionary');
const { getConnection } = require('../models/mongoMockConnection');

describe('Logar com um usuário', () => {
  const payloadUser = {
    name: 'Cássio Rodrigues Pereira',
    registry: '01512262225',
    password: '12345',
    balance: 0,
  };
  let connectionMock;

  // inserimos um usuário teste para simular um usuário já cadastrado
  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
    await connectionMock.db('bank_accounts').collection('accounts').insertOne(payloadUser);
  });

  after(async () => {
    await connectionMock.db('bank_accounts').collection('accounts').drop();
    MongoClient.connect.restore();
  });
  describe('quando o nome do usuário não é informado', () => {
    it('dispara um erro', async () => {
      const { password } = payloadUser;

      try {
        await loginService.login(undefined, password);
      } catch (error) {
        expect(error.status).to.be.eql(unauthorized);
        expect(error.message).to.equal('"registry" is required');
      }
    });
  });

  describe('quando a senha está incorreta', () => {
    it('dispara um erro', async () => {
      const wrongPassword = 'hello';
      const { registry } = payloadUser;

      try {
        await loginService.login(registry, wrongPassword);
      } catch (error) {
        expect(error.status).to.be.eql(unauthorized);
        expect(error.message).to.equal('Incorrect CPF or password');
      }
    });
  });

  describe('quando o usuário é logado com sucesso', () => {
    it('retorna um objeto', async () => {
      const { registry, password } = payloadUser;

      const response = await loginService.login(registry, password);

      expect(response).to.be.a('object');
      expect(response).to.have.all.keys('_id', 'name', 'registry', 'password', 'balance');
    });
  });
});
