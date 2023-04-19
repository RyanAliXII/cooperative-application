import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";

export const ShareLogModel = sequelize.define(
  "share_log",
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
    createdAt: {
      field: "created_at",
      type: DataTypes.DATE,
    },
  },
  { underscored: true }
);
