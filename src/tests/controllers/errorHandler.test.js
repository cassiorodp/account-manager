const sinon = require('sinon');
const { expect } = require('chai');
const {
  describe, it, before,
} = require('mocha');

const errorHandler = require('../../middlewares/errorHandler');
const { notFound, serverError } = require('../../utils/dictionary');

describe('Ao chamar o middleware de error', () => {
  const response = {};
  const request = {};
  let next = () => {};
  describe('quando há a propriedade "message" no objeto de erro', () => {
    const error = {
      message: 'test error message',
      status: notFound,
    };
    before(() => {
      request.body = {};
      request.user = {};

      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();

      next = sinon.stub().returns();
    });

    it('é chamado o método "status" passando o código 200', async () => {
      await errorHandler(error, request, response, next);
      expect(response.status.calledWith(notFound)).to.be.equal(true);
    });

    it('é chamado o método "json" passando um objeto', async () => {
      await errorHandler(error, request, response, next);
      expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
    });
  });

  describe('quando não há a propriedade message no objeto de erro', () => {
    const error = {};
    before(() => {
      request.body = {};
      request.user = {};

      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();

      next = sinon.stub().returns();
    });

    it('é chamado o método "status" passando o código 500', async () => {
      await errorHandler(error, request, response, next);
      expect(response.status.calledWith(serverError)).to.be.equal(true);
    });

    it('é chamado o método "json" passando um objeto', async () => {
      await errorHandler(error, request, response, next);
      expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
    });
  });
});
