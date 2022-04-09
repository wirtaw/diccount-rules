class BaseRule {
  constructor(amount, client_id, date, opt) {
    const { discount, minPrice, ...restOpt } = opt;
    this.client_id = client_id;
    this.date = date;
    this.amount = amount;
    this.discount = discount;
    this.minPrice = minPrice;
    this.opt = { ...restOpt };
  }
}

module.exports = BaseRule;
