const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const Teachers = sequelize.define(
  "teachers",
  {
    // Define the columns of the 'Questions' table
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    fname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phoneNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
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
    staff_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    // Other model options
    tableName: "teachers", // Name of the table in the database
    timestamps: false, // Include timestamps (createdAt, updatedAt)
  }
);

module.exports = Teachers;
