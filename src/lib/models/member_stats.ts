import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";

export const MemberStatModel = sequelize.define(
  "member_stats_view",
  {
    memberId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      field: "member_id",
      primaryKey: true,
    },
    givenName: {
      type: DataTypes.STRING,

      field: "given_name",
    },
    surname: {
      type: DataTypes.STRING,

      field: "surname",
    },
    cooperativeId: {
      field: "cooperative_id",
      type: DataTypes.UUID,
    },
    shares: {
      type: DataTypes.DECIMAL(10, 2),
      field: "shares",
      get() {
        const value = this.getDataValue("shares");
        return Number(value);
      },
    },
    sharesPrincipal: {
      type: DataTypes.DECIMAL(10, 2),
      field: "shares_principal",
      get() {
        const value = this.getDataValue("sharesPrincipal");
        return Number(value);
      },
    },
    sharesWithdrawal: {
      type: DataTypes.DECIMAL(10, 2),
      field: "shares_withdrawal",
      get() {
        const value = this.getDataValue("sharesWithdrawal");
        return Number(value);
      },
    },

    savings: {
      type: DataTypes.DECIMAL(10, 2),
      field: "savings",
      get() {
        const value = this.getDataValue("savings");
        return Number(value);
      },
    },
    savingsPrincipal: {
      type: DataTypes.DECIMAL(10, 2),
      field: "savings_principal",
      get() {
        const value = this.getDataValue("savingsPrincipal");
        return Number(value);
      },
    },
    savingsWithdrawal: {
      type: DataTypes.DECIMAL(10, 2),
      field: "savings_withdrawal",
      get() {
        const value = this.getDataValue("savingsWithdrawal");
        return Number(value);
      },
    },
    disbursedLoan: {
      type: DataTypes.DECIMAL(10, 2),
      field: "disbursed_loan",
      get() {
        const value = this.getDataValue("disbursedLoan");
        return Number(value);
      },
    },
    finishedLoan: {
      type: DataTypes.DECIMAL(10, 2),
      field: "finished_loan",
      get() {
        const value = this.getDataValue("finishedLoan");
        return Number(value);
      },
    },
    requestedLoan: {
      type: DataTypes.DECIMAL(10, 2),
      field: "requested_loan",
      get() {
        const value = this.getDataValue("requestedLoan");
        return Number(value);
      },
    },
    approvedLoan: {
      type: DataTypes.DECIMAL(10, 2),
      field: "approved_loan",
      get() {
        const value = this.getDataValue("approvedLoan");
        return Number(value);
      },
    },
    approvedLoanInterest: {
      type: DataTypes.DECIMAL(10, 2),
      field: "approved_loan_interest",
      get() {
        const value = this.getDataValue("approvedLoanInterest");
        return Number(value);
      },
    },
    requestedLoanInterest: {
      type: DataTypes.DECIMAL(10, 2),
      field: "requested_loan_interest",
      get() {
        const value = this.getDataValue("requestedLoanInterest");
        return Number(value);
      },
    },
    finishedLoanInterest: {
      type: DataTypes.DECIMAL(10, 2),
      field: "finished_loan_interest",
      get() {
        const value = this.getDataValue("finishedLoanInterest");
        return Number(value);
      },
    },
    disbursedLoanInterest: {
      type: DataTypes.DECIMAL(10, 2),
      field: "disbursed_loan_interest",
      get() {
        const value = this.getDataValue("disbursedLoanInterest");
        return Number(value);
      },
    },
  },
  {
    underscored: true,
    timestamps: false,
  }
);
