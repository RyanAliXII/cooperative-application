"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable("cooperative_category", {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
      },
      requiredAssets: {
        type: Sequelize.DECIMAL(10, 2),
        field: "required_assets",
        get() {
          const value = this.getDataValue("requiredAssets");
          return Number(value);
        },
      },
      createdAt: {
        field: "created_at",
        type: Sequelize.DATE,
      },
      updatedAt: {
        field: "updated_at",
        type: Sequelize.DATE,
      },
      deletedAt: {
        field: "deleted_at",
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.dropTable("cooperative_category");
  },
};
