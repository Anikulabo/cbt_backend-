const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const Score = sequelize.define(
  "Score",
  {
    // Define the columns of the 'Subjects' table
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
    },
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    CA: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    exam: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    CA_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    exam_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  },
  {
    // Other model options
    tableName: "scores", // Name of the table in the database
    timestamps: false, // Disable timestamps
  }
);
module.exports = Score;
