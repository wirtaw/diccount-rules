require('dotenv-flow').config({
  default_node_env: process.env.NODE_ENV,
});

const sequilize = {
  instance: 'db',
  autoConnect: false,
  dialect: 'postgres',
  storage: false,
};

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
  sequilize.autoConnect = !!process.env.SEQUELIZE_CONNECT;
  sequilize.dialect = process.env.SEQUELIZE_DIALECT;
  sequilize.storage = '';
} else {
  sequilize.dialect = 'sqlite';
  sequilize.storage = ':memory:';
}

module.exports = {
  main: {
    port: Number(process.env.PORT) || 3000,
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_DATABASE || 'db',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    pool: Number(process.env.DB_POOL) || 100,
    idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT) || 30000,
    timeConnectionMillis: Number(process.env.DB_CONNECTION_TIMEOUT) || 2000,
  },
  sequilize,
  exchangeRate: {
    url: process.env.EXCHANGE_URL || '',
  },
  rules: {
    rule3_interval: Number(process.env.RULES_3_INTERVAL_SECONDS) || 30 * 86400,
    discount: parseFloat(process.env.RULES_DISCOUNT) || 0.05,
    minPrice: parseFloat(process.env.RULES_MIN_PRICE) || 0.05,
  },
  transaction: {
    commissionCurrency: process.env.TRANSACTION_CURRENCY || 'EUR',
  },
};
