"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Markdown extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Markdown.belongsTo(models.User, { foreignKey: "doctorId", as: "doctorData" });
      Markdown.belongsTo(models.Specialty, { foreignKey: "specialtyId", as: "specialtyData" });
      Markdown.belongsTo(models.Clinic, { foreignKey: "clinicId", as: "clinicData" });
      Markdown.belongsTo(models.Doctor_Infor, { foreignKey: 'doctorId', as: 'doctorInfor' });

    }
  }
  Markdown.init(
    {
      contentHTML: DataTypes.TEXT("long"),
      contentMarkdown: DataTypes.TEXT("long"),
      description: DataTypes.TEXT("long"),
      doctorId: DataTypes.INTEGER,
      specialtyId: DataTypes.INTEGER,
      clinicId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Markdown",
    }
  );
  return Markdown;
};
