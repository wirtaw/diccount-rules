// eslint-disable-next-line node/no-unpublished-require
const chai = require('chai');
const { MockAgent, setGlobalDispatcher } = require('undici');

require('dotenv-flow').config({
  default_node_env: 'test',
});

const exchangeRates = require('../src/utils/exchangeRates');

const { expect } = chai;

const mockAgent = new MockAgent({ connections: 1 });
setGlobalDispatcher(mockAgent);

describe('test exchange rates', async () => {
  let currency;
  let date;
  let rate;
  let mockPool;

  before(async () => {
    mockPool = mockAgent.get('http://localhost');
  });

  beforeEach(async () => {
    currency = '';
    date = '';
    rate = 0;
    mockPool = mockAgent.get('http://localhost');
  });

  after(async () => {
    await mockAgent.close();
  });

  it('success to get rate', async () => {
    currency = 'USD';
    date = '2022-04-07';
    rate = 0.7;

    mockPool
      .intercept({ path: `/${date}` })
      .reply(200, { rates: { USD: rate } });
    const result = await exchangeRates.get(currency, date);

    expect(result).to.equal(rate, `rate to ${rate} for ${currency}`);
  });

  it('failed to get rate - no currency', async () => {
    currency = 'PLN';
    date = '2022-04-09';
    rate = 0;

    mockPool
      .intercept({ path: `/${date}` })
      .reply(400, null);
    const result = await exchangeRates.get(currency, date);

    expect(result).to.equal(rate, `rate to ${rate} for ${currency}`);
  });
});
