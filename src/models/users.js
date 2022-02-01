const connect = require('./connection');

const create = async (name, registry, password, balance = 0) => {
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

module.exports = {
  create,
  findByRegistry,
};
