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
const { unauthorized } = require('../../utils/dictionary');

describe('POST /deposit', () => {
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
});
