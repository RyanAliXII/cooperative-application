import { sequelize } from "./sequelize";
import { DataTypes } from "sequelize";
export const SharesLogModel = sequelize.define(
  "shares_log",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
    },
    remarks: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
  },
  { underscored: true }
);
