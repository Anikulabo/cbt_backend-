const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const User = sequelize.define(
  "Users",
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
    image:{
      type:DataTypes.STRING,
      allowNull:true,
      unique:true,
    }
    ,
    department:{
      type:DataTypes.STRING,
      allowNull:false,
      unique:false
    }
  },
  {
    // Other model options
    tableName: "Users", // Name of the table in the database
    timestamps: true, // Include timestamps (createdAt, updatedAt)
  }
);

module.exports = User;
