import { sequelize } from "./sequelize";
import { DataTypes } from "sequelize";

export const LoanModel = sequelize.define(
  "loan",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    principal: {
      type: DataTypes.DECIMAL(10, 2),
      get() {
        const value = this.getDataValue("principal");
        return Number(value);
      },
    },
    totalDue: {
      type: DataTypes.DECIMAL(10, 2),
      field: "total_due",
      get() {
        const value = this.getDataValue("totalDue");
        return Number(value);
      },
    },
    interest: {
      type: DataTypes.DECIMAL(10, 2),
      field: "interest",
      get() {
        const value = this.getDataValue("interest");
        return Number(value);
      },
    },
    status: {
      type: DataTypes.STRING,
    },
    remainingBalance: {
      type: DataTypes.DECIMAL(10, 2),
      field: "remaining_balance",
      get() {
        const value = this.getDataValue("remainingBalance");
        return Number(value);
      },
    },
    tenure: {
      type: DataTypes.INTEGER,
    },
    memberId: {
      type: DataTypes.BIGINT,
      field: "member_id",
      references: {
        model: "member",
        key: "id",
      },
    },
    cooperativeId: {
      type: DataTypes.UUID,
      field: "cooperative_id",
      references: {
        model: "cooperative",
        key: "id",
      },
    },
  },
  {
    paranoid: true,
    underscored: true,
  }
);
