import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";

export const SavingModel = sequelize.define(
  "saving",
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
      get() {
        const value: any = this.getDataValue("amount");
        return Number(value);
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
