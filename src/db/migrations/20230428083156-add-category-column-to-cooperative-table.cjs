"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn("cooperative", "category_id", {
      type: Sequelize.UUID,
      references: {
        model: "cooperative_category",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("cooperative", "category_id");
  },
};
