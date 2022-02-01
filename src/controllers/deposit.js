const depositService = require('../services/deposit');
const { success } = require('../utils/dictionary');

const deposit = async (req, res, next) => {
  try {
    const { value } = req.body;
    const { registry: userAccount } = req.user;

    // conta atualizada
    const updatedAccount = await depositService
      .deposit(userAccount, value);

    return res.status(success).json(updatedAccount);
  } catch (error) {
    console.error(`Create User -> ${error.message}`);
    next(error);
    return null;
  }
};

module.exports = {
  deposit,
};
