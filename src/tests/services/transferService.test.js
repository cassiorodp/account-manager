const sinon = require('sinon');
const { expect } = require('chai');
const {
  describe, it, before, after,
} = require('mocha');
const transferService = require('../../services/transfer');
const userModel = require('../../models/users');
const { badRequest } = require('../../utils/dictionary');

describe('Transferir um valor', () => {
  const payloadUser = {
    registry: '01512262225',
    otherRegistry: '00011122224',
    value: 1000,
  };
  describe('quando a conta do usuário não é informada', () => {
    it('dispara um erro', async () => {
      const { otherRegistry, value } = payloadUser;

      try {
        await transferService.transfer(undefined, otherRegistry, value);
      } catch (error) {
        expect(error.status).to.be.eql(badRequest);
        expect(error.message).to.equal('"userAccount" is required');
      }
    });
  });

  describe('quando a conta a ser transferido o valor não é informada', () => {
    it('dispara um erro', async () => {
      const { registry, value } = payloadUser;

      try {
        await transferService.transfer(registry, undefined, value);
      } catch (error) {
        expect(error.status).to.be.eql(badRequest);
        expect(error.message).to.equal('"transferAccount" is required');
      }
    });
  });

  describe('quando o valor não é informado', () => {
    it('dispara um erro', async () => {
      const { registry, otherRegistry } = payloadUser;

      try {
        await transferService.transfer(registry, otherRegistry, undefined);
      } catch (error) {
        expect(error.status).to.be.eql(badRequest);
        expect(error.message).to.equal('"value" is required');
      }
    });
  });

  // describe('quando o valor depositado é acima do limite', () => {
  //   it('dispara um erro', async () => {
  //     const forbiddenValue = 2001;
  //     const { registry } = payloadUser;

  //     try {
  //       await depositService.deposit(registry, forbiddenValue);
  //     } catch (error) {
  //       expect(error.status).to.be.eql(badRequest);
  //       expect(error.message).to.equal('"value" must be less than or equal to 2000');
  //     }
  //   });
  // });

  // describe('quando o deposito é feito com sucesso', () => {
  //   // é simulado o retorno da função `updateBalance`
  //   before(() => {
  //     const { name, value } = payloadUser;
  //     const response = {};
  //     response.name = name;
  //     response.balance = value;

  //     sinon.stub(userModel, 'findByRegistry')
  //       .resolves(response);
  //   });
  //   after(() => {
  //     userModel.findByRegistry.restore();
  //   });

  //   it('retorna um objeto', async () => {
  //     const { registry, value } = payloadUser;

  //     const response = await depositService.deposit(registry, value);

  //     expect(response).to.be.an('object');
  //     expect(response).to.have.all.keys('updatedBalance', 'name');
  //   });
  // });
});
