"use strict";

const { UUID } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("cooperative_criteria", {
      id: {
        type: UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      financialPerformancePoints: {
        type: Sequelize.INTEGER,
        field: "financial_performance_points",
        allowNull: false,
        defaultValue: 0,
      },
      organizationManagementPoints: {
        type: Sequelize.INTEGER,
        field: "org_management_points",
        allowNull: false,
        defaultValue: 0,
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
    return queryInterface.dropTable("cooperative_criteria");
  },
};
