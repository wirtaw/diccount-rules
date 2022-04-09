const TransactionCalculation = {
  type: 'object',
  properties: {
    client_id: { type: 'integer' },
    date: { type: 'string' },
    amount: { type: 'string' },
    currency: { type: 'string' },
    commission_amount: { type: 'number' },
    commission_currency: { type: 'string' },
  },
};

module.exports = TransactionCalculation;
