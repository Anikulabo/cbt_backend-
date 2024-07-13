const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const Sessions = sequelize.define(
  "Sessions",
  {
    // Define the columns of the 'Questions' table
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    sessionName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    term:{
      type:DataTypes.STRING,
      allowNull:false
    },
    active:{
      type:DataTypes.BOOLEAN,
      default:true
    }
  },
  {
    // Other model options
    tableName: "Sessions", // Name of the table in the database
    timestamps: false, // Include timestamps (createdAt, updatedAt)
  }
);

module.exports = Sessions;