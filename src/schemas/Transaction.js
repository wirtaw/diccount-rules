const Transaction = {
  type: 'object',
  properties: {
    date: { type: 'string' },
    amount: { type: 'string', minimum: 0.01 },
    currency: { type: 'string', enum: ['EUR', 'USD', 'PLN', 'GBP', 'ILS'] },
    client_id: { type: 'integer', minimum: 1 },
  },
};

module.exports = Transaction;
