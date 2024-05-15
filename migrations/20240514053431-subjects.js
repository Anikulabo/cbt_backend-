'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Subjects", {
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
      subjectName:{
        allowNull:false,
        type:Sequelize.STRING,
        unique:false
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Subjects");
  },
};
