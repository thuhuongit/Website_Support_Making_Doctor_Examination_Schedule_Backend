'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      address:{
        type: Sequelize.STRING
      },
      phone:{
        type: DataTypes.STRING
      },
      gender:{
        type: Sequelize.BOOLEAN
      },
      image:{
        type: Sequelize.STRING
      },
      roleId:{
        type: Sequelize.STRING
      },
      positionId:{
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
    await queryInterface.dropTable('Users');
  }
};