'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('history', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      patientId: {
        type: Sequelize.INTEGER
      },
      dotorId: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT
      },
      files: {
        type: Sequelize.BLOB("long"),
        allowNull: true,
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
    await queryInterface.dropTable('history');
  }
};