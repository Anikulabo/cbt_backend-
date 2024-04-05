const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const Subject = sequelize.define(
    "Subject",
    {
      // Define the columns of the 'Subjects' table
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name:{
        type:DataTypes.STRING,
        allowNull:true,
        unique:true
      },
    },
    {
      // Other model options
      tableName: "Subjects", // Name of the table in the database
      timestamps: true, // Include timestamps (createdAt, updatedAt)
    }
  );
  module.exports = Subject;