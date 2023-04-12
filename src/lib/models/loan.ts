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
    },
    totalDue: {
      type: DataTypes.DECIMAL(10, 2),
      field: "total_due",
    },
    interest: {
      type: DataTypes.DECIMAL(10, 2),
      field: "interest",
    },
    status: {
      type: DataTypes.STRING,
    },
    remainingBalance: {
      type: DataTypes.DECIMAL(10, 2),
      field: "remaining_balance",
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
