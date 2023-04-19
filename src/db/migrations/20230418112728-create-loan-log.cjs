"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("loan_log", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      description: {
        type: Sequelize.TEXT,
        defaultValue: "",
      },
      value: {
        type: Sequelize.DECIMAL(10, 2),
        field: "value",
        get() {
          const value = this.getDataValue("value");
          return Number(value);
        },
      },
      createdAt: {
        field: "created_at",
        type: Sequelize.DATE,
      },
      cooperativeId: {
        type: Sequelize.UUID,
        field: "cooperative_id",
        references: {
          model: "cooperative",
          key: "id",
        },
      },
      updatedAt: {
        field: "updated_at",
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("loan_log");
  },
};
