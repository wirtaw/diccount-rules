const BaseRule = require('./base/BaseRule');

class Client42 extends BaseRule {
  calculate() {
    if (this.client_id === 42) {
      return 0.05;
    }
  }
}

module.exports = Client42;
