const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const  Departments= sequelize.define(
  "Departments",
  {
    // Define the columns of the 'Subjects' table
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
   name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Other model options
    tableName: "departments", // Name of the table in the database
    timestamps: false, // Disable timestamps
  }
);
module.exports = Departments;
