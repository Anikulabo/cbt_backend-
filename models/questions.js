const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const Subject = require("./subjects.js");
const Question = sequelize.define(
  "Question",
  {
    // Define the columns of the 'Questions' table
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    subject_id:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    option_a: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    option_b: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    option_c: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    option_d: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correctAnswer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    session_id:{
      type:DataTypes.INTEGER,
      allowNull:false
    }
  },
  {
    // Other model options
    tableName: "questions", // Name of the table in the database
    timestamps: false, // Include timestamps (createdAt, updatedAt)
  }
);

module.exports = Question;
