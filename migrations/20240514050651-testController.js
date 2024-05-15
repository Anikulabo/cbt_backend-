'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TestController", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      class_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: true,
      },
      subject_id:{
        allowNull:false,
        type:Sequelize.INTEGER,
        unique:false
      },
      timeAllocated:{
        allowNull:false,
        type:Sequelize.TIME,
        unique:false
      },
      status:{
        allowNull:false,
        type:Sequelize.INTEGER,
        unique:false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("TestController");
  },
};
