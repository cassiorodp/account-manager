const chai = require('chai');
const sinon = require('sinon');
const {
  describe, it, before, after,
} = require('mocha');

const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const { expect } = chai;
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../models/mongoMockConnection');
const server = require('../../api/app');
const { unauthorized, success } = require('../../utils/dictionary');

describe('POST /login', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });

  describe('Quando a senha não é informada', () => {
    let response;
    const payloadUser = {
      registry: '011312252226',
    };

    before(async () => {
      response = await chai.request(server)
        .post('/login')
        .send(payloadUser);
    });

    it('retorna código de status "401"', () => {
      expect(response).to.have.status(unauthorized);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('a propriedade "message" possui a mensagem ""password" is required"', () => {
      expect(response.body.message).to.be.equal('"password" is required');
    });
  });

  describe('Quando o CPF informado não existe ou senha é inválida', () => {
    let response;
    const payloadUser = {
      registry: '01131222222',
      password: '000000',
    };

    before(async () => {
      response = await chai.request(server)
        .post('/login')
        .send(payloadUser);
    });

    it('retorna código de status "401"', () => {
      expect(response).to.have.status(unauthorized);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('a propriedade "message" possui a mensagem "Incorrect CPF or password"', () => {
      expect(response.body.message).to.be.equal('Incorrect CPF or password');
    });
  });

  describe('Quando os dados são validos', () => {
    let response;
    const payloadUser = {
      name: 'Cássio Rodrigues Pereira',
      registry: '011312252226',
      password: '12345',
      balance: 0,
    };

    before(async () => {
      // simulando uma conta já existente
      const accountCollection = connectionMock.db('bank_accounts').collection('accounts');
      await accountCollection.insertOne(payloadUser);

      response = await chai.request(server)
        .post('/login')
        .send({
          registry: '011312252226',
          password: '12345',
        });
    });

    after(async () => {
      await connectionMock.db('bank_accounts').collection('accounts').drop();
    });

    it('retorna código de status "200"', () => {
      expect(response).to.have.status(success);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "token"', () => {
      expect(response.body).to.have.property('token');
    });

    it('a propriedade "token" deve conter um token JWT com o registry usado no login no seu payload', () => {
      const { registry } = payloadUser;
      const { token } = response.body;
      const payload = jwt.decode(token);
      expect(payload.data.registry).to.be.equal(registry);
    });
  });
});
