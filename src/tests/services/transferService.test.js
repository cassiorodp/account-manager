const sinon = require('sinon');
const { expect } = require('chai');
const {
  describe, it, before, after,
} = require('mocha');
const transferService = require('../../services/transfer');
const userModel = require('../../models/users');
const { badRequest, conflict } = require('../../utils/dictionary');

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

  describe('quando o valor informado é maior do que o saldo em conta', () => {
    before(() => {
      const balance = {
        balance: 0,
      };
      sinon.stub(userModel, 'findByRegistry')
        .resolves(balance);
    });

    after(() => {
      userModel.findByRegistry.restore();
    });

    it('dispara um erro', async () => {
      const { registry, otherRegistry, value } = payloadUser;
      try {
        await transferService.transfer(registry, otherRegistry, value);
      } catch (error) {
        expect(error.status).to.be.eql(conflict);
        expect(error.message).to.equal('insufficient balance');
      }
    });
  });

  describe('quando a transferencia é feita com sucesso', () => {
    before(() => {
      const { value } = payloadUser;
      const user = {
        balance: 1000,
      };
      sinon.stub(userModel, 'findByRegistry')
        .resolves(user);

      const updatedUser = {
        name: 'Cássio Rodrigues Pereira',
        balance: user.balance - value,
      };
      sinon.stub(userModel, 'updateBalance')
        .resolves(updatedUser);
    });

    after(() => {
      userModel.findByRegistry.restore();
    });

    it('retorna um objeto', async () => {
      const { registry, otherRegistry, value } = payloadUser;

      const response = await transferService.transfer(registry, otherRegistry, value);

      expect(response).to.be.an('object');
      expect(response.updatedBalance).to.eql(0);
      expect(response.name).to.eql('Cássio Rodrigues Pereira');
    });
  });
});
