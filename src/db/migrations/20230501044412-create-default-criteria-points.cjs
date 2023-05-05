"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("default_criteria_point", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      categoryId: {
        field: "category_id",
        type: Sequelize.UUID,
        references: {
          model: "cooperative_category",
          key: "id",
        },
      },
      cooperativeId: {
        field: "cooperative_id",
        type: Sequelize.UUID,
        references: {
          model: "cooperative",
          key: "id",
        },
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
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("default_criteria_point");
  },
};
