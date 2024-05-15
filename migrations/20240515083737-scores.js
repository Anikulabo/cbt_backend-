'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Scores", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: false,
      },
      subject_id:{
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: false,
      },
      status:{
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: false
      },
      score:{
        allowNull:false,
        type:Sequelize.INTEGER,
        unique:false
      },
      session_id:{
        allowNull:false,
        type:Sequelize.INTEGER,
        unique:false  
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Scores");
  }
};
