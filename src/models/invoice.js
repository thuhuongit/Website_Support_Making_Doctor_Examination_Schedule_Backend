"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Invoice.belongsTo(models.User, {
        foreignKey: "doctorId",
        targetKey: "id",
        as: "doctorDataInvoice",
      });
      Invoice.belongsTo(models.User, {
        foreignKey: "patientId",
        targetKey: "id",
        as: "patientDataInvoice",
      });
      Invoice.belongsTo(models.Specialty, {
        foreignKey: "specialtyId",
        targetKey: "id",
        as: "specialtyInvoiceData",
      });
    }
  }
  Invoice.init(
    {
      doctorId: DataTypes.INTEGER,
      patientId: DataTypes.INTEGER,
      specialtyId: DataTypes.INTEGER,
      totalCost: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Invoice",
    }
  );
  return Invoice;
};
