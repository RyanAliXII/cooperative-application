"use strict";

const { UUID } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn("cooperative_category", "criteria_id", {
      type: UUID,
      references: {
        model: "cooperative_criteria",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("cooperative_category", "criteria_id");
  },
};
