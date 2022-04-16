const { DateTime } = require('luxon');
const BaseRule = require('./base/BaseRule');

const models = require('../../models');

const Transactions = models.Transactions;

class Rule1000 extends BaseRule {
  formatData(items) {
    return items
      .map(item => item.dataValues)
      .map(item => ({
        date: DateTime.fromISO(item.date),
        amount: Number(item.amount),
        currency: item.currency,
        commission_amount: Number(item.commission_amount),
        commission_currency: item.commission_currency,
      }));
  }

  filterByDate(items, pastSeconds) {
    const end = DateTime.fromISO(this.date);
    const start = DateTime.fromISO(this.date).minus({
      seconds: pastSeconds,
    });
    return items.filter(
      item =>
        item.date.toMillis() >= start.toMillis() &&
                item.date.toMillis() <= end.toMillis()
    );
  }

  sumAmountCommission(items) {
    return items.reduce((acc, curr) => {
      acc += curr.amount + curr.commission_amount;
      return acc;
    }, 0);
  }

  async getPastTransactions(pastSeconds) {
    const clientData = await Transactions.findAll({
      where: { client_id: this.client_id },
    });
    const clientFormattedData = this.formatData(clientData);
    const dataFromRange = this.filterByDate(
      clientFormattedData,
      pastSeconds
    );
    return this.sumAmountCommission(dataFromRange);
  }

  async calculate() {
    const monthTransactions = await this.getPastTransactions(
      this.opt.rule3_interval
    );
    if (!monthTransactions) {
      return;
    }

    if (monthTransactions > 1000) {
      return 0.03;
    }
  }
}

module.exports = Rule1000;
