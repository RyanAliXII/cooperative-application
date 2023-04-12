"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    queryInterface.createTable("loan", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      principal: {
        type: Sequelize.DECIMAL(10, 2),
      },
      totalDue: {
        type: Sequelize.DECIMAL(10, 2),
        field: "total_due",
      },
      interest: {
        type: Sequelize.DECIMAL(10, 2),
        field: "interest",
      },
      status: {
        type: Sequelize.STRING,
      },
      tenure: {
        type: Sequelize.INTEGER,
      },
      remainingBalance: {
        type: Sequelize.DECIMAL(10, 2),
        field: "remaining_balance",
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("loan");
  },
};
