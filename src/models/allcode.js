'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {
    static associate(models) {
      // Định danh các mối quan hệ nếu có
    }
  }

  Allcode.init({
    key: DataTypes.STRING,
    type: DataTypes.STRING,
    valueEn: DataTypes.STRING,
    valueVi: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Allcode',
    tableName: 'allcode',  // ✅ Đảm bảo đúng tên bảng trong MySQL
    timestamps: false,     // Nếu bảng không có `createdAt`, `updatedAt`
  });

  return Allcode;
};
