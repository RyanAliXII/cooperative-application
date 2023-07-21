"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addIndex("member_account", ["email"], {
      unique: true,
    });
  },
  async down(queryInterface, Sequelize) {},
};
