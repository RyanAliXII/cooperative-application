import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";

export const CriteriaFieldPointModel = sequelize.define(
  "criteria_field_point",

  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    categoryId: {
      type: DataTypes.UUID,
      field: "category_id",
      references: {
        model: "cooperative_category",
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
    criteriaFieldId: {
      type: DataTypes.UUID,
      field: "criteria_field_id",
      references: {
        model: "criteria_field",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    points: {
      type: DataTypes.INTEGER,
      field: "points",
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    underscored: true,
  }
);
