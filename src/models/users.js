const connect = require('./connection');

const create = async (name, registry, password, balance) => {
  const conn = await connect();

  const { insertedId } = await conn.collection('accounts').insertOne({
    name, registry, password, balance,
  });

  return insertedId;
};

const findByRegistry = async (registry) => {
  const conn = await connect();

  const user = await conn.collection('accounts').findOne({ registry });

  return user;
};

const updateBalance = async (registry, value) => {
  const conn = await connect();

  await conn.collection('accounts').updateOne(
    { registry },
    { $inc: { balance: value } },
  );

  const user = await conn.collection('accounts').findOne({ registry });

  return user;
};

module.exports = {
  create,
  findByRegistry,
  updateBalance,
};
