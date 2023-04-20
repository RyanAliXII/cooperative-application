import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";

export const SavingLogModel = sequelize.define(
  "saving_log",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      field: "value",
      get() {
        const value = this.getDataValue("value");
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
  },
  { underscored: true }
);
