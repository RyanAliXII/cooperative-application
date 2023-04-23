import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";

export const CooperativeStatModel = sequelize.define(
  "stats_view",
  {
    cooperativeId: {
      field: "cooperative_id",
      type: DataTypes.UUID,
      primaryKey: true,
    },
    cooperativeName: {
      field: "cooperative_name",
      type: DataTypes.STRING,
    },
    loanInterest: {
      type: DataTypes.DECIMAL(10, 2),
      field: "loan_interest",
      get() {
        const value = this.getDataValue("loanInterest");
        return Number(value);
      },
    },
    shares: {
      type: DataTypes.DECIMAL(10, 2),
      field: "shares",
      get() {
        const value = this.getDataValue("shares");
        return Number(value);
      },
    },
    withdrawnShares: {
      type: DataTypes.DECIMAL(10, 2),
      field: "withdrawn_shares",
      get() {
        const value = this.getDataValue("withdrawnShares");
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
    savings: {
      type: DataTypes.DECIMAL(10, 2),
      field: "savings",
      get() {
        const value = this.getDataValue("savings");
        return Number(value);
      },
    },
    withdrawnSavings: {
      type: DataTypes.DECIMAL(10, 2),
      field: "withdrawn_savings",
      get() {
        const value = this.getDataValue("withdrawnSavings");
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
    loan: {
      type: DataTypes.DECIMAL(10, 2),
      field: "loan",
      get() {
        const value = this.getDataValue("loan");
        return Number(value);
      },
    },
    assets: {
      type: DataTypes.DECIMAL(10, 2),
      field: "assets",
      get() {
        const value = this.getDataValue("assets");
        return Number(value);
      },
    },
    registrationFees: {
      type: DataTypes.DECIMAL(10, 2),
      field: "registration_fees",
      get() {
        const value = this.getDataValue("registrationFees");
        return Number(value);
      },
    },
    members: {
      type: DataTypes.DECIMAL(10, 2),
      field: "members",
      get() {
        const value = this.getDataValue("members");
        return Number(value);
      },
    },

    liquidity: {
      type: DataTypes.DECIMAL(10, 2),
      field: "liquidity",
      get() {
        const value = this.getDataValue("liquidity");
        return Number(value);
      },
    },
  },
  {
    underscored: true,
    timestamps: false,
  }
);
