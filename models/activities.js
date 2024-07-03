const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const Activities = sequelize.define(
  "Activities",
  {
    // Define the columns of the 'Questions' table
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    performed_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    // Other model options
    tableName: "activities", // Name of the table in the database
    timestamps: false, // Include timestamps (createdAt, updatedAt)
  }
);

module.exports = Activities;
