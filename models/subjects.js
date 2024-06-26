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
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
    },
    subjectName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
  },
  {
    // Other model options
    tableName: "subjects", // Name of the table in the database
    timestamps: false, // Include timestamps (createdAt, updatedAt)
  }
);
module.exports = Subject;
