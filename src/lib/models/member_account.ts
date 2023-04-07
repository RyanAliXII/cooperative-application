import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";
export const MemberAccountModel = sequelize.define(
  "member_account",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      field: "mobile_number",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    memberId: {
      type: DataTypes.BIGINT,
      field: "member_id",
      references: {
        model: "member",
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
    },
  },
  {
    underscored: true,
  }
);
