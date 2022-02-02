const sinon = require('sinon');
const { expect } = require('chai');
const {
  describe, before, it, after,
} = require('mocha');
const { MongoClient } = require('mongodb');
const usersModel = require('../../models/users');
const usersService = require('../../services/users');
const { badRequest, conflict } = require('../../utils/dictionary');
const { getConnection } = require('../models/mongoMockConnection');

describe('Cria um novo usuário no banco de dados', () => {
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
      const { registry, password, balance } = payloadUser;

      try {
        await usersService.create(undefined, registry, password, balance);
      } catch (error) {
        expect(error.status).to.be.eql(badRequest);
        expect(error.message).to.equal('"name" is required');
      }
    });
  });

  describe('quando o usuário ja está cadastrado', () => {
    it('dispara um erro', async () => {
      const {
        name, registry, password, balance,
      } = payloadUser;

      try {
        await usersService.create(name, registry, password, balance);
      } catch (error) {
        expect(error.status).to.be.eql(conflict);
        expect(error.message).to.equal('CPF already registered');
      }
    });
  });

  describe('quando o usuário é inserido com sucesso', () => {
    before(() => {
      const ID_EXAMPLE = '604cb554311d68f491ba5781';

      sinon.stub(usersModel, 'create')
        .resolves(ID_EXAMPLE);
    });

    // Restauraremos a função `create` original após os testes.
    after(() => {
      usersModel.create.restore();
    });

    it('retorna um objeto', async () => {
      const anotherUser = {
        name: 'another user',
        registry: '00000000000',
        password: '12345',
        balance: 0,
      };
      const {
        name, registry, password, balance,
      } = anotherUser;
      const response = await usersService.create(name, registry, password, balance);
      expect(response).to.be.a('object');
    });

    it('tal objeto possui uma chave "user" com o id retornado da camada model', async () => {
      const anotherUser = {
        name: 'another user',
        registry: '00000000000',
        password: '12345',
        balance: 0,
      };
      const {
        name, registry, password, balance,
      } = anotherUser;
      const response = await usersService.create(name, registry, password, balance);

      expect(response.user).to.have.property('_id');
    });
  });
});
