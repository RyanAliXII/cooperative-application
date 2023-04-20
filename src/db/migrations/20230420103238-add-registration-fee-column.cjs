"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn("member", "registration_fee", {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("member", "registration_fee");
  },
};
