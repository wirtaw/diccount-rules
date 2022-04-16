const fastify = require('fastify');

const build = require('./server');
const configs = require('./config');

const start = async () => {
  try {
    const app = build({
      logger: {
        level: 'info',
        prettyPrint: true,
      },
    });

    await app.listen(configs.main.port);
  } catch (err) {
    fastify.log.error(err);
    throw new Error(err.message);
  }
};
start();
