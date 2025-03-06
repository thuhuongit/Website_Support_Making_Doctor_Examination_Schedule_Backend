'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        //bulkInsert : chen nhieu bang ghi cung 1 luc
        email: 'admin@gmail.com',
        password:'123456', 
        firstName: 'ThuHuong',
        lastName: 'Le',
        address: 'VietNam',
        gender: 0,
        typeRole: 'ROLE',
        keyRole: 'R1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
 
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
