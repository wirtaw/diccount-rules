const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const build = require('../src/server');

require('dotenv-flow').config({
  default_node_env: 'test',
});

chai.use(chaiHttp);
const { expect } = chai;

const models = require('../models');

const Transactions = models.Transactions;

const transactionMocks = require('./mocks/transactionMockList');
const configs = require('../src/config');

const exchangeRatesService = require('../src/utils/ExchangeRates');

describe('test transaction API', async () => {
  let reqBody = {
    client_id: null,
    amount: null,
    date: null,
    currency: null,
  };
  let rate;
  let fastify;
  let exchangeRates;
  let server;

  before(async () => {
    await Transactions.sync({ force: true });
    fastify = build({});
    await fastify.ready();
    await Transactions.sync({ force: true });
    await Transactions.bulkCreate(transactionMocks);

    server = await fastify.listen(3000);
  });

  beforeEach(async () => {
    reqBody = {
      client_id: null,
      amount: null,
      date: null,
      currency: null,
    };
    rate = null;

    exchangeRates = sinon.stub(exchangeRatesService, 'get');
  });

  afterEach(async () => {
    await Transactions.sync({ force: true });
    await Transactions.bulkCreate(transactionMocks);
    exchangeRates.restore();
  });

  it('it should POST the transaction and calculate by rule 1', done => {
    reqBody = {
      client_id: 1,
      amount: '140',
      date: '2021-07-08',
      currency: 'USD',
    };

    rate = 1.1;

    exchangeRates.returns(Promise.resolve(rate));

    chai.request(server)
      .post('/api/v1/transaction')
      .send(reqBody)
      .end((err, res) => {
        const {
          client_id, amount, date, currency, commission_amount, commission_currency,
        } = res.body;

        expect(res.status).to.equal(200, 'status is 200');
        expect(client_id).to.equal(reqBody.client_id, 'calculate transaction client_id is expected same like body');
        expect(amount).to.equal(reqBody.amount, 'calculate transaction amount is expected same like body');
        expect(date).to.equal(reqBody.date, 'calculate transaction date is expected same like body');
        expect(currency).to.equal('USD', 'calculate transaction currency expect USD');
        expect(commission_amount).to.equal(Number(reqBody.amount) * rate * configs.rules.discount, 'calculate transaction commission_amount expect base rule 1');
        expect(commission_currency).to.equal('EUR', 'calculate transaction commission_currency expect base to be EUR');

        done();
      });
  });

  it('it should POST the transaction and calculate by rule 2', done => {
    reqBody = {
      client_id: 42,
      amount: '140',
      date: '2021-07-08',
      currency: 'PLN',
    };

    rate = 1.3;

    exchangeRates.returns(Promise.resolve(rate));

    chai.request(server)
      .post('/api/v1/transaction')
      .send(reqBody)
      .end((err, res) => {
        const {
          client_id, amount, date, currency, commission_amount, commission_currency,
        } = res.body;

        expect(res.status).to.equal(200, 'status is 200');
        expect(client_id).to.equal(reqBody.client_id, 'calculate transaction client_id is expected same like body');
        expect(amount).to.equal(reqBody.amount, 'calculate transaction amount is expected same like body');
        expect(date).to.equal(reqBody.date, 'calculate transaction date is expected same like body');
        expect(currency).to.equal('PLN', 'calculate transaction currency expect USD');
        expect(commission_amount).to.equal(0.05, 'calculate transaction commission_amount expect base rule 1');
        expect(commission_currency).to.equal('EUR', 'calculate transaction commission_currency expect base to be EUR');

        done();
      });
  });
});
