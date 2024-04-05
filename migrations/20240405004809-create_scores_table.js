'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("Scores", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id:{
        allowNull:false,
        type:Sequelize.INTEGER,
        unique:true
      },
      subject: {
        allowNull: false,
        type: Sequelize.STRING,
        unique:true
      },
      score: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Scores');
  }
};
