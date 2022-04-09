const BaseRule = require('./base/BaseRule');

class Start extends BaseRule {
  calculate() {
    const value = this.amount * this.discount;
    if (value < this.minPrice) {
      return this.minPrice;
    }
    return value;
  }
}

module.exports = Start;
