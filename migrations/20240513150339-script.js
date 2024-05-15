"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Scripts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      subject_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: true,
      },
      question: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: false,
      },
      correctAnswer: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: false,
      },
      choosenOption: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: false,
      },
      session_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Script");
  },
};
