import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";

export const SelectedCooperativeModel = sequelize.define(
  "selected_cooperative",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
