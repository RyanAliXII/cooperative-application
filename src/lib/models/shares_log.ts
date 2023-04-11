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
    cooperativeId: {
      type: DataTypes.UUID,
      field: "cooperative_id",
      references: {
        model: "cooperative",
        key: "id",
      },
    },
    memberId: {
      type: DataTypes.BIGINT,
      field: "member_id",
      references: {
        model: "member",
        key: "id",
      },
    },
    remarks: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
  },
  { underscored: true, paranoid: true }
);
