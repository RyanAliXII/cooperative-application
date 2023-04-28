import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";

export const CooperativeCategoryModel = sequelize.define(
  "cooperative_category",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
    },
    requiredAssets: {
      type: DataTypes.DECIMAL(10, 2),
      field: "required_assets",
      get() {
        const value = this.getDataValue("requiredAssets");
        return Number(value);
      },
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
