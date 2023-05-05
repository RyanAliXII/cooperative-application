"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn("cooperative", "registration_date", {
      type: Sequelize.DATEONLY,
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("cooperative", "registration_date");
  },
};
