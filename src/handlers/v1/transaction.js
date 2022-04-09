const exchangeRatesService = require('../../utils/ExchangeRates');
const { getRules, findMinimalDiscount } = require('../../rules');
const configs = require('../../config');

const models = require('../../../models');

const Transactions = models.Transactions;

const postTransaction = async (request, reply) => {
  const {
    amount, date, currency, client_id,
  } = request.body;
  const commission_currency = configs.transaction.commissionCurrency;
  const exchangeRate = (currency.toUpperCase() !== commission_currency) ? await exchangeRatesService.get(currency.toUpperCase(), date) : 1;

  if (Number.isNaN(Number(amount))) {
    return reply.code(500).send({ errorMessage: 'Amount is not a number', errorType: 'FAILED_AMOUNT' });
  }

  const amountExchanged = Number(amount) * exchangeRate;
  const rules = await getRules();

  if (!rules || Object.keys(rules).length === 0) {
    return reply.code(500).send({ errorMessage: 'No rules to calculate transaction', errorType: 'NO_RULES' });
  }
  const commission_amount = await findMinimalDiscount(
    { amount: amountExchanged, date, client_id },
    rules,
    { ...configs.rules },
  );
  if (!commission_amount) {
    request.log.error('Commission amount calculation error ', {
      amount: amountExchanged, date, client_id, rules,
    });
    return reply.code(500).send({ errorMessage: 'Some calculate transaction problems', errorType: 'COMMISSION_CALCULATE_PROBLEMS' });
  }
  request.log.info(`Commission amount ${commission_amount}`);

  const transaction = await Transactions.create({
    client_id,
    date,
    amount: amountExchanged,
    currency: commission_currency,
    commission_amount,
    commission_currency,
  });

  request.log.info(`Insert to DB ${transaction}`);

  return reply.send({
    client_id,
    date,
    amount,
    currency,
    commission_amount,
    commission_currency,
  });
};

module.exports = { postTransaction };
