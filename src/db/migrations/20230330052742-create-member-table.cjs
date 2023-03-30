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

    queryInterface.createTable("member", {
      id: {
        type: Sequelize.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      givenName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "given_name",
      },
      middleName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "middle_name",
      },
      surname: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "surname",
      },
      birthday: {
        type: Sequelize.DataTypes.DATEONLY,
        allowNull: false,
        field: "birthday",
      },
      civilStatus: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "civil_status",
      },
      spouseName: {
        type: Sequelize.DataTypes.STRING,
        field: "spouse_name",
      },
      presentAddress: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        field: "present_address",
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      mobileNumber: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "mobile_number",
      },
      officePhoneNumber: {
        type: Sequelize.DataTypes.STRING,
        field: "office_phone_number",
      },
      dependents: {
        type: Sequelize.DataTypes.JSONB,
      },
      cooperativeId: {
        type: Sequelize.DataTypes.UUID,
        field: "cooperative_id",
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        field: "created_at",
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        field: "updated_at",
      },
      cooperativeId: {
        type: Sequelize.DataTypes.UUID,
        field: "cooperative_id",
        references: {
          model: "cooperative",
          key: "id",
        },
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
    queryInterface.dropTable("member");
  },
};
