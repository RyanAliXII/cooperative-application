import { sequelize } from "./sequelize";
import { DataTypes } from "sequelize";
export const MemberShareModel = sequelize.define(
  "member_share",
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
      type: DataTypes.DECIMAL(10, 2),
      get() {
        const value = this.getDataValue("amount");
        return Number(value);
      },
    },
  },
  { underscored: true }
);
