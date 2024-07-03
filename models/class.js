const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const Class = sequelize.define(
  "class",
  {
    // Define the columns of the 'Subjects' table
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    teacherId:{
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },
  {
    // Other model options
    tableName: "classes", // Name of the table in the database
    timestamps: false, // Disable timestamps
  }
);
//relatinoships
module.exports = Class;
