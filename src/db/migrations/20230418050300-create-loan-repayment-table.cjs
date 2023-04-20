"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("loan_repayment", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      amountPaid: {
        type: Sequelize.DECIMAL(10, 2),
        field: "amount_paid",
        get() {
          const value = this.getDataValue("amountPaid");
          return Number(value);
        },
      },
      loanId: {
        type: Sequelize.UUID,
        field: "loan_id",
        references: {
          model: "loan",
          key: "id",
        },
      },
      remarks: {
        type: Sequelize.TEXT,
        defaultValue: "",
      },
      balanceBeforeRepayment: {
        type: Sequelize.DECIMAL(10, 2),
        field: "balance_before_repayment",
        get() {
          const value = this.getDataValue("amountBeforeRepayment");
          return Number(value);
        },
      },
      remainingBalance: {
        type: Sequelize.DECIMAL(10, 2),
        field: "remaining_balance",
        get() {
          const value = this.getDataValue("remainingBalance");
          return Number(value);
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
    queryInterface.dropTable("loan_repayment");
  },
};
