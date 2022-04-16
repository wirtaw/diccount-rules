const fastify = require('fastify');
const fastifyOAS = require('fastify-oas');
const fsequelize = require('fastify-sequelize');

const transactionRoutes = require('./routes/v1/transactionRoutes');
const TransactionSchema = require('./schemas/Transaction');
const TransactionCalculationSchema = require('./schemas/TransactionCalculation');
const configs = require('./config');

function build(opts = {}) {
  const app = fastify(opts);
  let sequilizeOpt;

  if ([':memory:'].includes(configs.sequilize.storage)) {
    sequilizeOpt = { ...configs.sequilize };
    sequilizeOpt.storage = configs.sequilize.storage;
  } else {
    const {
      host,
      port,
      database,
      user: username,
      password,
    } = configs.database;
    sequilizeOpt = {
      ...configs.sequilize,
      database,
      username,
      password,
      options: {
        host,
        port,
      },
    };
  }

  app.register(fsequelize, sequilizeOpt).ready(err => {
    if (err) {
      console.error('Unable to connect to the database:', err);
    }
  });

  app.register(fastifyOAS, {
    routePrefix: '/docs',
    swagger: {
      info: {
        title: 'Transaction API',
        description: 'the fastify swagger api',
        version: '0.1.0',
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
      host: 'localhost:3000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'transaction', description: 'Transaction end-points' },
      ],
      definitions: {
        Transaction: TransactionSchema,
        Calculation: TransactionCalculationSchema,
      },
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header',
        },
      },
    },
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    exposeRoute: true,
  });

  // API routes register
  app.register(transactionRoutes, { logLevel: 'warn', prefix: '/api/v1/' });

  return app;
}

module.exports = build;
