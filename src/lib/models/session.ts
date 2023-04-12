import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";
export const SessionModel = sequelize.define(
  "session",
  {
    sid: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    data: {
      type: DataTypes.JSONB,
    },
    appType: {
      type: DataTypes.STRING,
      field: "app_type",
    },
    expiresAt: {
      type: DataTypes.DATE,
      field: "expires_at",
    },
  },
  {
    underscored: true,
  }
);
