const exchangeRatesService = require('../../utils/exchangeRates');
const { getRules, findMinimalDiscount } = require('../../rules');
const configs = require('../../config');

const models = require('../../../models');

const Transactions = models.Transactions;

const postTransaction = async (request, reply) => {
  const { amount, date, currency, client_id } = request.body;
  const { commissionCurrency } = configs.transaction;

  if (Number.isNaN(Number(amount))) {
    return reply
      .code(400)
      .send({
        message: 'Amount is not a number',
        error: 'FAILED_AMOUNT',
      });
  }

  const exchangeRate =
    currency.toUpperCase() !== commissionCurrency
      ? await exchangeRatesService.get(currency.toUpperCase(), date)
      : 1;

  if (exchangeRate === 0) {
    return reply
      .code(400)
      .send({
        message: 'exchange rate is 0',
        error: 'FAILED_EXCHANGE_RATE',
      });
  }

  const amountExchanged = Number(amount) * exchangeRate;
  const rules = await getRules();

  if (!rules || Object.keys(rules).length === 0) {
    return reply
      .code(400)
      .send({
        message: 'No rules to calculate transaction',
        error: 'NO_RULES',
      });
  }
  const commissionAmount = await findMinimalDiscount(
    { amount: amountExchanged, date, client_id },
    rules,
    { ...configs.rules }
  );
  if (!commissionAmount) {
    request.log.error('Commission amount calculation error ', {
      amount: amountExchanged,
      date,
      client_id,
      rules,
    });
    return reply
      .code(400)
      .send({
        message: 'Some calculate transaction problems',
        error: 'COMMISSION_CALCULATE_PROBLEMS',
      });
  }
  request.log.info(`Commission amount ${commissionAmount}`);

  const transaction = await Transactions.create({
    client_id,
    date,
    amount: amountExchanged,
    currency: commissionCurrency,
    commissionAmount,
    commission_currency: commissionCurrency,
  });

  request.log.info(`Insert to DB ${transaction}`);

  return reply.send({
    client_id,
    date,
    amount,
    currency,
    commission_amount: commissionAmount,
    commission_currency: commissionCurrency,
  });
};

module.exports = { postTransaction };
