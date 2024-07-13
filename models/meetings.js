const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const Meetings = sequelize.define(
  "Meetings",
  {
    // Define the columns of the 'Questions' table
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    performed_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    max_particpant: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    meeting_link:{
        type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    // Other model options
    tableName: "meetings", // Name of the table in the database
    timestamps: false, // Include timestamps (createdAt, updatedAt)
  }
);

module.exports = Meetings;
