"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("criteria_field_point", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
      criteriaFieldId: {
        field: "criteria_field_id",
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        references: {
          model: "criteria_field",
          key: "id",
        },
      },
      points: {
        type: Sequelize.INTEGER,
        field: "points",
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
    return queryInterface.dropTable("criteria_field_point");
  },
};
