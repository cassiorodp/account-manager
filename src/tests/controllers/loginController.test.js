const sinon = require('sinon');
const { expect } = require('chai');
const {
  describe, it, before, after,
} = require('mocha');

const loginService = require('../../services/login');
const loginController = require('../../controllers/login');
const { success } = require('../../utils/dictionary');

describe('Ao chamar o controller login', () => {
  const response = {};
  const request = {};
  let next = () => {};
  const error = new Error('error');
  describe('quando as credenciais informadas são invalidas', () => {
    before(() => {
      request.body = {};

      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();

      sinon.stub(loginService, 'login')
        .rejects(error);

      next = sinon.stub().returns();
    });

    /* Restauraremos a função `login` original após os testes. */
    after(() => {
      loginService.login.restore();
    });

    it('é chamado o next com o parametro "error"', async () => {
      await loginController.login(request, response, next);
      expect(next.calledWith(error)).to.be.equal(true);
    });
  });

  describe('quando as credenciais informadas são validas', () => {
    before(() => {
      const payloadUser = {
        name: 'Cássio Rodrigues Pereira',
        registry: '011312252226',
        password: '12345',
        balance: 0,
      };
      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();

      sinon.stub(loginService, 'login')
        .resolves(payloadUser);
    });

    after(() => {
      loginService.login.restore();
    });

    it('é chamado o método "status" passando o código 200', async () => {
      await loginController.login(request, response, next);
      expect(response.status.calledWith(success)).to.be.equal(true);
    });

    it('é chamado o método "json" passando um objeto', async () => {
      await loginController.login(request, response, next);
      expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
    });
  });
});
