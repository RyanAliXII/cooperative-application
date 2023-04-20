"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("saving", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      remarks: {
        type: Sequelize.TEXT,
        defaultValue: "",
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
      },
      cooperativeId: {
        type: Sequelize.DataTypes.UUID,
        field: "cooperative_id",
        references: {
          model: "cooperative",
          key: "id",
        },
      },
      memberId: {
        type: Sequelize.BIGINT,
        field: "member_id",
        references: {
          model: "member",
          key: "id",
        },
      },
      createdAt: {
        field: "created_at",
        type: Sequelize.DATE,
      },
      deletedAt: {
        field: "deleted_at",
        type: Sequelize.DATE,
      },
      updatedAt: {
        field: "updated_at",
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("saving");
  },
};
