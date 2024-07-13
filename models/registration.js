const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const Registration = sequelize.define(
  "registration",
  {
    // Define the columns of the 'Questions' table
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
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
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sex:{
        type: DataTypes.ENUM('M','F'),
      allowNull: false,
    },
    DOB: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    address:{
        type: DataTypes.STRING,
      allowNull: false,
    },
    class_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    session_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    regNo:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    parent:{
      type: DataTypes.INTEGER,
    allowNull: false,
  }
  },
  {
    // Other model options
    tableName: "registration", // Name of the table in the database
    timestamps: false, // Include timestamps (createdAt, updatedAt)
  }
);

module.exports = Registration;
