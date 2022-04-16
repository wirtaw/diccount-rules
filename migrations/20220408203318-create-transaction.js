'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      client_id: {
        type: Sequelize.INTEGER,
      },
      date: {
        type: Sequelize.STRING,
      },
      amount: {
        type: Sequelize.STRING,
      },
      currency: {
        type: Sequelize.STRING,
      },
      commission_amount: {
        type: Sequelize.DOUBLE,
      },
      commission_currency: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Transactions');
  },
};
