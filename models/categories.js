const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const Category = sequelize.define(
  "Category",
  {
    // Define the columns of the 'Subjects' table
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
   years: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    // Other model options
    tableName: "Categories", // Name of the table in the database
    timestamps: false, // Disable timestamps
  }
);
module.exports = Category;
