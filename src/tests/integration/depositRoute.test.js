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
const { unauthorized, badRequest } = require('../../utils/dictionary');

describe('POST /deposit', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });

  describe('Quando não está autenticado', () => {
    let response;
    const payloadUser = {
      value: 1000,
    };

    before(async () => {
      response = await chai.request(server)
        .post('/deposit')
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

    it('a propriedade "message" possui a mensagem "missing auth token"', () => {
      expect(response.body.message).to.be.equal('missing auth token');
    });
  });

  describe('Quando é um valor acima de R$2000,00', () => {
    let response;
    const request = {
      value: 2001,
    };
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

      // primeiro, é armazenado o token para simular um usuário autenticado
      const token = await chai.request(server)
        .post('/login')
        .send({
          registry: '011312252226',
          password: '12345',
        })
        .then((res) => res.body.token);

      // após, é enviado o token no header "autorization"
      response = await chai.request(server)
        .post('/deposit')
        .send(request)
        .set('authorization', token);
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

    it('a propriedade "message" possui a mensagem ""value" must be less than or equal to 2000"', () => {
      expect(response.body.message).to.be.equal('"value" must be less than or equal to 2000');
    });
  });
});
