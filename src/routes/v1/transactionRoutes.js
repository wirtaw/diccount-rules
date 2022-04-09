const { postTransaction } = require('../../handlers/v1/transaction');
const TransactionSchema = require('../../schemas/Transaction');

const postTransactionOpts = {
  schema: {
    description: 'post transaction',
    tags: ['transaction'],
    summary: 'Calculate transaction discount',
    body: {
      ...TransactionSchema,
    },
    response: {
      200: {
        type: 'object',
        properties: {
          client_id: { type: 'integer' },
          date: { type: 'string' },
          amount: { type: 'string' },
          currency: { type: 'string' },
          commission_amount: { type: 'number' },
          commission_currency: { type: 'string' },
        },
      },
      500: {
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },
  handler: postTransaction,
};

module.exports = async function (fastify, opts, done) {
  fastify.post('/transaction', postTransactionOpts);
  done();
};
