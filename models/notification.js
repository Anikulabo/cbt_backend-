  const { DataTypes } = require("sequelize");
  const sequelize = require("../config/database");
  const Notifications = sequelize.define(
    "notifications",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      activity_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      to: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      seen: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      tableName: "notifications",
      timestamps: false,
    }
  );

  // If you need associations, define them here
  // Notifications.associate = function(models) {
  //   // associations can be defined here
  // };

  module.exports = Notifications;