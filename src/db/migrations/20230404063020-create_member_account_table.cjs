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

    await queryInterface.createTable("member_account", {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
      },
      givenName: {
        type: Sequelize.DataTypes.STRING,
        field: "given_name",
      },
      middleName: {
        type: Sequelize.DataTypes.STRING,
        field: "middle_name",
      },
      surname: {
        type: Sequelize.DataTypes.STRING,
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      memberId: {
        type: Sequelize.DataTypes.BIGINT,
        field: "member_id",
        references: {
          model: "member",
          key: "id",
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        field: "created_at",
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: "updated_at",
      },
      approvedAt: {
        type: Sequelize.DATE,
        field: "approved_at",
      },
      rejectedAt: {
        type: Sequelize.DATE,
        field: "rejected_at",
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
    await queryInterface.dropTable("member_account");
  },
};
