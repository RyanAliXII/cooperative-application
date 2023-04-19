import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";

export const LoanRepaymentModel = sequelize.define(
  "loan_repayment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    amountPaid: {
      type: DataTypes.DECIMAL(10, 2),

      field: "amount_paid",
      get() {
        const value = this.getDataValue("amountPaid");
        return Number(value);
      },
    },
    balanceBeforeRepayment: {
      type: DataTypes.DECIMAL(10, 2),
      field: "balance_before_repayment",
      get() {
        const value = this.getDataValue("balanceBeforeRepayment");
        return Number(value);
      },
    },
    remainingBalance: {
      type: DataTypes.DECIMAL(10, 2),
      field: "remaining_balance",
      get() {
        const value = this.getDataValue("remainingBalance");
        return Number(value);
      },
    },
    remarks: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    loanId: {
      type: DataTypes.UUID,
      field: "loan_id",
      references: {
        model: "loan",
        key: "id",
      },
    },
  },
  {
    underscored: true,
  }
);
