const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const Registeredcourses = sequelize.define(
  "registeredcourses",
  {
    // Define the columns of the 'Subjects' table
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
    },
    sessionName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    // Other model options
    tableName: "registeredcourses", // Name of the table in the database
    timestamps: false, // Disable timestamps
  }
);
module.exports = Registeredcourses;
