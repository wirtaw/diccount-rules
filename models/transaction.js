'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Transactions.init({
    client_id: DataTypes.NUMBER,
    date: DataTypes.STRING,
    amount: DataTypes.STRING,
    currency: DataTypes.STRING,
    commission_amount: DataTypes.NUMBER,
    commission_currency: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Transactions',
  });
  return Transactions;
};
