import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";

export const CooperativeCriteriaModel = sequelize.define(
  "cooperative_criteria",
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
    paranoid: true,
  }
);
