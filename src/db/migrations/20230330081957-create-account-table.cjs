"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, { DataTypes: { UUID, UUIDV4, STRING, DATE } }) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.createTable("account", {
      id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      givenName: {
        type: STRING,
        allowNull: false,
        field: "given_name",
      },
      middleName: {
        type: STRING,
        field: "middle_name",
      },
      surname: {
        type: STRING,
        allowNull: false,
        field: "surname",
      },
      email: {
        type: STRING,
        allowNull: false,
        field: "email",
        unique: true,
      },
      password: {
        type: STRING,
        allowNull: false,
        field: "password",
      },
      createdAt: {
        type: DATE,
        field: "created_at",
      },
      updatedAt: {
        type: DATE,
        field: "updated_at",
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

    queryInterface.dropTable("account");
  },
};
