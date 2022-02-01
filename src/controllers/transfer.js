const transferService = require('../services/transfer');
const { success } = require('../utils/dictionary');

const transfer = async (req, res, next) => {
  try {
    const { transferAccount, value } = req.body;
    const { registry: userAccount } = req.user;

    // conta atualizada
    const updatedAccount = await transferService
      .transfer(userAccount, transferAccount, value);

    return res.status(success).json(updatedAccount);
  } catch (error) {
    console.log(`Create User -> ${error.message}`);
    next(error);
  }
};

module.exports = {
  transfer,
};
