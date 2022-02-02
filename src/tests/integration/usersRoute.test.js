const chai = require('chai');
const sinon = require('sinon');
const {
  describe, it, before, after,
} = require('mocha');

const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const { expect } = chai;
const { MongoClient } = require('mongodb');
const { getConnection } = require('../models/mongoMockConnection');
const server = require('../../api/app');
const { badRequest, created } = require('../../utils/dictionary');

describe('POST /users', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });

  describe('Quando não é informado o nome', () => {
    let response;
    const payloadUser = {
      registry: '011312252226',
      password: '12345',
      balance: 0,
    };

    before(async () => {
      response = await chai.request(server)
        .post('/users')
        .send(payloadUser);
    });

    it('retorna código de status "400"', () => {
      expect(response).to.have.status(badRequest);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('a propriedade "message" possui a mensagem ""name" is required"', () => {
      expect(response.body.message).to.be.equal('"name" is required');
    });
  });

  describe('Quando são informados os dados corretos', () => {
    let response;
    const payloadUser = {
      name: 'Cássio Rodrigues Pereira',
      registry: '01131225222',
      password: '12345',
      balance: 0,
    };

    before(async () => {
      response = await chai.request(server)
        .post('/users')
        .send(payloadUser);
    });

    it('retorna código de status "201"', () => {
      expect(response).to.have.status(created);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "user"', () => {
      expect(response.body).to.have.property('user');
    });

    it('a propriedade "user" possui as chaves', () => {
      expect(response.body.user).to.have.all.keys('_id', 'name', 'registry', 'balance');
    });
  });
});
