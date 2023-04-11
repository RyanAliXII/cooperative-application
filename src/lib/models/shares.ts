import { sequelize } from "./sequelize";
import { DataTypes } from "sequelize";
export const SharesModel = sequelize.define(
  "shares",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    memberId: {
      type: DataTypes.BIGINT,
      field: "member_id",
      references: {
        model: "member",
        key: "id",
      },
    },
    total: {
      type: DataTypes.DECIMAL,
    },
  },
  { underscored: true }
);
