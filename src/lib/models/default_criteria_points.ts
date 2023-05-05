import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";

export const DefaultCriteriaPointModel = sequelize.define(
  "default_criteria_point",
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
    financialPerformancePoints: {
      type: DataTypes.INTEGER,
      field: "financial_performance_points",
      allowNull: false,
      defaultValue: 0,
    },
    organizationManagementPoints: {
      type: DataTypes.INTEGER,
      field: "org_management_points",
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    underscored: true,
  }
);
