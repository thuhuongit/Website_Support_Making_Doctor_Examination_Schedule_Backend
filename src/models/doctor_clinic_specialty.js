'use strict';
const {
  Model
} = require('sequelize');
const clinic = require('./clinic');
const specialty = require('./specialty');
module.exports = (sequelize, DataTypes) => {
  class Doctor_Clinic_Specialty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Đinh danh các mối quan hệ ví dụ như 1 bác sĩ thuộc 1 phòng khám hoặc nhiều phòng khám 



    }
  }
  Doctor_Clinic_Specialty.init({
    
    doctorId: DataTypes.INTEGER,
    clinicId: DataTypes.INTEGER,
    specialtyId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Doctor_Clinic_Specialty',
  });
  return Doctor_Clinic_Specialty;
};