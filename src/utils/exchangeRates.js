const { request } = require('undici');
const configs = require('../config');

const exchangeRatesService = {
  get: async (from, date) => {
    let rate = 0;
    if (!configs.exchangeRate.url) {
      return rate;
    }

    const { statusCode, body } = await request(
      `${configs.exchangeRate.url}/${date}`
    );

    if (statusCode === 200) {
      const data = await body.json();
      const { rates } = data;

      if (rates && rates[from.toUpperCase()]) {
        rate = rates[from.toUpperCase()];
      }
    }

    return rate;
  },
};

module.exports = exchangeRatesService;
