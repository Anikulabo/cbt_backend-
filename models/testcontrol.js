const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const TestControl = sequelize.define(
  "TestControl",
  {
    // Define the columns of the 'Subjects' table
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("exam",'test'),
      allowNull:false
    },
  },
  {
    // Other model options
    tableName: "testcontrol", // Name of the table in the database
    timestamps: false, // Disable timestamps
  }
);
module.exports = TestControl;
