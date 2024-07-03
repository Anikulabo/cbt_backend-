const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const Users = sequelize.define(
  "users",
  {
    // Define the columns of the 'Questions' table
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role:{
      type: DataTypes.INTEGER,
      allowNull: false,
    }
      },
  {
    // Other model options
    tableName: "users", // Name of the table in the database
    timestamps: false, // Include timestamps (createdAt, updatedAt)
  }
);

module.exports = Users;
