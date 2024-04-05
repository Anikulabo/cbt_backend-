'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username:{
        allowNull:false,
        type:Sequelize.STRING,
        unique:true
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
        unique:false
      },
      image: {
        allowNull: false,
        type: Sequelize.STRING,
        unique:true
      },
     department:{
      allowNull:false,
      type: Sequelize.STRING
     }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Scores');
  }
};
