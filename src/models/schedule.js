'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    static associate(models) {
      Schedule.belongsTo(models.Allcode, {
        foreignKey: 'timeType',
        targetKey: 'keyMap',
        as: 'timeTypeData',
      });
      Schedule.belongsTo(models.User, {
        foreignKey: 'doctorId',
        targetKey: 'id',
        as: 'doctorData',
      });
    }
  }

  Schedule.init(
    {
      currentNumber: DataTypes.INTEGER,
      maxNumber: DataTypes.INTEGER,
      date: DataTypes.DATE,
      timeType: DataTypes.STRING,
      doctorId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Schedule',
      tableName: 'schedules', // Explicitly set table name
    }
  );
  return Schedule;
};
