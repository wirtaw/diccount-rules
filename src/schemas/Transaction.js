const Transaction = {
  type: 'object',
  properties: {
    date: { type: 'string' },
    amount: { type: 'string', minimum: 0.01 },
    currency: { type: 'string' },
    client_id: { type: 'integer', minimum: 1 },
  },
};

module.exports = Transaction;
