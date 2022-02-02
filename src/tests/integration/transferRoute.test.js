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
const {
  unauthorized, badRequest, conflict, success,
} = require('../../utils/dictionary');

describe('POST /transfer', () => {
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

  describe('Quando não é informado a conta a ser tranferido o valor', () => {
    let response;
    const request = {
      value: 2000,
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
        .post('/transfer')
        .send(request)
        .set('authorization', token);
    });

    after(async () => {
      await connectionMock.db('bank_accounts').collection('accounts').drop();
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

    it('a propriedade "message" possui a mensagem ""transferAccount" is required"', () => {
      expect(response.body.message).to.be.equal('"transferAccount" is required');
    });
  });

  describe('Quando o valor informado é maior do que o saldo', () => {
    let response;
    const request = {
      transferAccount: '00511222260',
      value: 1100,
    };
    const payloadUser = {
      name: 'Cássio Rodrigues Pereira',
      registry: '011312252226',
      password: '12345',
      balance: 1000,
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
        .post('/transfer')
        .send(request)
        .set('authorization', token);
    });

    after(async () => {
      await connectionMock.db('bank_accounts').collection('accounts').drop();
    });

    it('retorna código de status "409"', () => {
      expect(response).to.have.status(conflict);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('a propriedade "message" possui a mensagem "insufficient balance"', () => {
      expect(response.body.message).to.be.equal('insufficient balance');
    });
  });

  describe('Quando a transção é feita com sucesso', () => {
    let response;
    const request = {
      transferAccount: '00511222260',
      value: 1000,
    };
    const payloadUser = {
      name: 'Cássio Rodrigues Pereira',
      registry: '011312252226',
      password: '12345',
      balance: 2000,
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
        .post('/transfer')
        .send(request)
        .set('authorization', token);
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

    it('objeto de resposta possui as propriedades "updatedBalance" e "name"', () => {
      expect(response.body).to.have.all.keys('updatedBalance', 'name');
    });

    it('a propriedade "updatedBalance" o saldo atualizado', () => {
      const updatedBalance = payloadUser.balance - request.value;
      expect(response.body.updatedBalance).to.be.equal(updatedBalance);
    });
  });
});
