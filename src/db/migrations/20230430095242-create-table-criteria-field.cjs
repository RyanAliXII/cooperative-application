"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("criteria_field", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      maxPoints: {
        type: Sequelize.INTEGER,
        field: "max_points",
        allowNull: false,
      },
      criteriaId: {
        field: "criteria_id",
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        references: {
          model: "cooperative_criteria",
          key: "id",
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
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("criteria_field");
  },
};
