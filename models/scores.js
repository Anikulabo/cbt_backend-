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
      user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        unique:true
      },
     subject:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:false
     },
     score:{
        type:DataTypes.INTEGER,
        allowNull:true,
     } 
    },
    {
      // Other model options
      tableName: "Subjects", // Name of the table in the database
      timestamps: true, // Include timestamps (createdAt, updatedAt)
    }
  );
  module.exports = Score;