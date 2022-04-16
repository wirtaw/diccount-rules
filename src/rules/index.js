const fs = require('fs');
const path = require('path');

const DIR_PATH = path.resolve('./src/rules/');

const getRules = async () => {
  const dirItems = await fs.promises.readdir(DIR_PATH);
  const rulesFiles = dirItems.filter(
    fileName => fileName.indexOf('.js') > -1 && fileName !== 'index.js'
  );
  for (const file of rulesFiles) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    exports[file.replace('.js', '')] = require(`./${file}`);
  }
  return exports;
};

const findMinimalDiscount = async (transaction, rules, opt) => {
  const calculations = [];
  const { amount, client_id, date } = transaction;

  Object.values(rules).forEach(Cl => {
    const obj = new Cl(amount, client_id, date, opt);
    calculations.push(obj.calculate());
  });

  const values = await Promise.all(calculations);
  const filteredValues = values
    .filter(value => !!value)
    .sort((a, b) => a - b);

  if (Array.isArray(filteredValues) && filteredValues.length > 0) {
    return filteredValues[0];
  }

  return 0;
};

module.exports = { getRules, findMinimalDiscount };
