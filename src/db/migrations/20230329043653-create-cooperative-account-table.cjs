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

    await queryInterface.createTable(
      "cooperative_account",
      {
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
        cooperativeId: {
          type: Sequelize.DataTypes.UUID,
          field: "cooperative_id",
          references: {
            model: "cooperative",
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
      },
      {
        uniqueKeys: {
          email_coop_unique: {
            fields: ["email", "cooperative_id"],
          },
        },
      }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("cooperative_account");
  },
};
