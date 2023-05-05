import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";

export const CooperativeRankingModel = sequelize.define(
  "ranking_view",
  {
    cooperativeId: {
      type: DataTypes.UUID,
      field: "cooperative_id",
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      field: "category_id",
    },
    points: {
      type: DataTypes.INTEGER,
      field: "points",
    },
    organizationManagementPoints: {
      type: DataTypes.INTEGER,
      field: "org_mgmt_points",
    },
    financialPerformancePoints: {
      type: DataTypes.INTEGER,
      field: "financial_performance_points",
    },
    overridenOrganizationManagementPoints: {
      type: DataTypes.INTEGER,
      field: "overriden_org_management_points",
    },
    overridenFinancialPerformancePoints: {
      type: DataTypes.INTEGER,
      field: "overriden_financial_performance_points",
    },
    rankPosition: {
      type: DataTypes.INTEGER,
      get() {
        const value = this.getDataValue("rankPosition");
        return Number(value);
      },
      field: "rank_position",
    },
  },
  { underscored: true, timestamps: false }
);
