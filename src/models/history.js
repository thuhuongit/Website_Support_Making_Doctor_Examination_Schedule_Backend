'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Đinh danh các mối quan hệ ví dụ như 1 bác sĩ thuộc 1 phòng khám hoặc nhiều phòng khám 



    }
  }
  History.init({
    
    patientId: DataTypes.INTEGER,
    doctorId: DataTypes.INTEGER,
    description  : DataTypes.TEXT,
    files: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};