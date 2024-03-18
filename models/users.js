const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");

const User = sequelize.define(
  "User",
  {
    // Define the columns of the 'Users' table
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image:{
      type:DataTypes.STRING,
      allowNull:true,
      unique:true,
    }
    ,score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }, 
  },
  {
    // Other model options
    tableName: "Users", // Name of the table in the database
    timestamps: true, // Include timestamps (createdAt, updatedAt)
  }
);

module.exports = User;
