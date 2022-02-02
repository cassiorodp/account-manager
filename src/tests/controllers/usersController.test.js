const sinon = require('sinon');
const { expect } = require('chai');
const {
  describe, it, before, after,
} = require('mocha');

const usersService = require('../../services/users');
const usersController = require('../../controllers/users');
const { created } = require('../../utils/dictionary');

describe('Ao chamar o controller createUser', () => {
  describe('quando o payload informado não é válido', () => {
    const response = {};
    const request = {};
    let next = () => {};
    const error = new Error('error');

    before(() => {
      request.body = {};

      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();

      sinon.stub(usersService, 'create')
        .rejects(error);

      next = sinon.stub().returns();
    });

    /* Restauraremos a função `createUser` original após os testes. */
    after(() => {
      usersService.create.restore();
    });

    it('é chamado o next com o parametro "error"', async () => {
      await usersController.createUser(request, response, next);
      expect(next.calledWith(error)).to.be.equal(true);
    });
  });

  describe('quando é inserido com sucesso', () => {
    const response = {};
    const request = {};

    before(() => {
      request.body = {
        name: 'Cássio Rodrigues Pereira',
        registry: '011312252226',
        password: '12345',
        balance: 0,
      };

      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();

      const { password: _password, ...requestWithoutPassword } = request.body;
      const userServiceResponse = {
        user: requestWithoutPassword,
      };
      sinon.stub(usersService, 'create')
        .resolves(userServiceResponse);
    });
    /* Restauraremos a função `create` original após os testes. */
    after(() => {
      usersService.create.restore();
    });

    it('é chamado o status com o código 201', async () => {
      await usersController.createUser(request, response);

      expect(response.status.calledWith(created)).to.be.equal(true);
    });

    it('é chamado o json com a mensagem "Filme criado com sucesso!"', async () => {
      await usersController.createUser(request, response);

      expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
    });
  });
});
