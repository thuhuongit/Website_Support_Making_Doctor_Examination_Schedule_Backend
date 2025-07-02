'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        email: '',
        password:'', 
        firstName: '',
        lastName: '',
        address: '',
        gender: 0,
        typeRole: '',
        keyRole: '',
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
