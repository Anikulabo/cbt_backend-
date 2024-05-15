const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const Class = sequelize.define(
    "class",
    {
      // Define the columns of the 'Subjects' table
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      class:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
      }
    },
    {
      // Other model options
      tableName: "class", // Name of the table in the database
      timestamps: false, // Disable timestamps
    }
  );
  module.exports = Class;