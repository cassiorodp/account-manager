const sinon = require('sinon');
const { expect } = require('chai');
const {
  describe, it, before, after,
} = require('mocha');

const depositService = require('../../services/deposit');
const depositController = require('../../controllers/deposit');
const { success } = require('../../utils/dictionary');

describe('Ao chamar o controller deposit', () => {
  const response = {};
  const request = {};
  let next = () => {};
  const error = new Error('error');
  describe('quando as credenciais informadas são invalidas', () => {
    before(() => {
      request.body = {};
      request.user = {};

      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();

      sinon.stub(depositService, 'deposit')
        .rejects(error);

      next = sinon.stub().returns();
    });

    /* Restauraremos a função `createUser` original após os testes. */
    after(() => {
      depositService.deposit.restore();
    });

    it('é chamado o next com o parametro "error"', async () => {
      await depositController.deposit(request, response, next);
      expect(next.calledWith(error)).to.be.equal(true);
    });
  });

  describe('quando as credenciais informadas são validas', () => {
    before(() => {
      const payloadUser = {
        name: 'Cássio Rodrigues Pereira',
        updatedBalance: 0,
      };
      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();

      sinon.stub(depositService, 'deposit')
        .resolves(payloadUser);
    });

    after(() => {
      depositService.deposit.restore();
    });

    it('é chamado o método "status" passando o código 200', async () => {
      await depositController.deposit(request, response, next);
      expect(response.status.calledWith(success)).to.be.equal(true);
    });

    it('é chamado o método "json" passando um objeto', async () => {
      await depositController.deposit(request, response, next);
      expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
    });
  });
});
