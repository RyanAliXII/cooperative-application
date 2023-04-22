import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";

export const RewardModel = sequelize.define(
  "reward",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    certificateType: {
      type: DataTypes.STRING,
      field: "cetificate_type",
      allowNull: false,
    },
    certificateDescription: {
      type: DataTypes.TEXT,
      field: "certificate_description",
      allowNull: false,
    },
    createdAt: {
      field: "created_at",
      type: DataTypes.DATE,
    },
    updatedAt: {
      field: "updated_at",
      type: DataTypes.DATE,
    },
    deletedAt: {
      field: "deleted_at",
      type: DataTypes.DATE,
    },
  },
  {
    underscored: true,
    paranoid: true,
  }
);
