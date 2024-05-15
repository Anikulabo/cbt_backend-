'use strict';

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
      subject_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: false,
      },
      question:{
        allowNull:false,
        type:Sequelize.STRING,
        unique:false,
      },
      option_a:{
        allowNull:false,
        type:Sequelize.STRING,
        unique:false,
      },
      option_b:{
        allowNull:false,
        type:Sequelize.STRING,
        unique:false,
      },
      option_c:{
        allowNull:false,
        type:Sequelize.STRING,
        unique:false,
      },
      option_d:{
        allowNull:false,
        type:Sequelize.STRING,
        unique:false,
      },
      correctAnswer:{
        allowNull:false,
        type:Sequelize.STRING,
        unique:false,
      },
      session_id:{
        allowNull:false,
        type:Sequelize.INTEGER,
        unique:false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Questions");
  },
};
