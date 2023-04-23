import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";

export const RecognitionModel = sequelize.define("recognition", {
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
  rewardId: {
    type: DataTypes.UUID,
    field: "reward_id",
    references: {
      model: "reward",
      key: "id",
    },
  },
  date: {
    type: DataTypes.DATEONLY,
  },
  createdAt: {
    field: "created_at",
    type: DataTypes.DATE,
  },
  updatedAt: {
    field: "updated_at",
    type: DataTypes.DATE,
  },
});
