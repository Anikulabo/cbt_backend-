'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Session", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sessionName: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Sessions");
  },
};
