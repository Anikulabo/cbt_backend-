"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Questions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      question: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      option_a: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      option_b: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      option_c: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      option_d: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      correctAnswer: {
        allowNull: false,
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Questions');
  },
};
