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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    timeAllocated:{
      type:DataTypes.TIME,
      allowNull:false,
      unique:false
    }
  },
  {
    // Other model options
    tableName: "subjects", // Name of the table in the database
    timestamps: false, // Include timestamps (createdAt, updatedAt)
  }
);
module.exports = Subject;
