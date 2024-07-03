const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const Scripts = sequelize.define(
  "Scripts",
  {
    // Define the columns of the 'Subjects' table
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    option_choosen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correctAnswer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    // Other model options
    tableName: "scripts", // Name of the table in the database
    timestamps: false, // Disable timestamps
  }
);
module.exports = Scripts;
