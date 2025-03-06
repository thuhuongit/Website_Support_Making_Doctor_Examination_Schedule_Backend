'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('allcode', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      key: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      valueEn: {
        type: Sequelize.STRING
      },

      valueVi:{
        type: Sequelize.STRING
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },//Ngày cập nhật 
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      } //Ngày tạo 
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('allcode');
  }
};