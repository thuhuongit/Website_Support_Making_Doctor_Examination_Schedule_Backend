'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Specialty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Đinh danh các mối quan hệ ví dụ như 1 bác sĩ thuộc 1 phòng khám hoặc nhiều phòng khám 



    }
  }
  Specialty.init({

    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    
    
  }, {
    sequelize,
    modelName: 'Specialty',
  });
  return Specialty;
};