const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const Subjects = sequelize.define(
  "Subjects",
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
    },
    teacherid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    compulsory:{
      type:DataTypes.BOOLEAN,
      allowNull:false
    }
  },
  {
    // Other model options
    tableName: "subjects", // Name of the table in the database
    timestamps: false, // Include timestamps (createdAt, updatedAt)
  }
);
module.exports = Subjects;
