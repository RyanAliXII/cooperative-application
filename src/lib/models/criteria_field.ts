import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";

export const CriteriaFieldModel = sequelize.define(
  "criteria_field",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxPoints: {
      type: DataTypes.INTEGER,
      field: "max_points",
      allowNull: false,
    },
    criteriaId: {
      field: "criteria_id",
      type: DataTypes.UUID,
      onDelete: "CASCADE",
      references: {
        model: "cooperative_criteria",
        key: "id",
      },
    },
  },
  {
    underscored: true,
  }
);
