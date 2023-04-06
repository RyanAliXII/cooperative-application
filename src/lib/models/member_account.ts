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
    givenName: {
      type: DataTypes.STRING,
      field: "given_name",
    },
    middleName: {
      type: DataTypes.STRING,
      field: "middle_name",
    },
    surname: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    approvedAt: {
      type: DataTypes.DATE,
      field: "approved_at",
    },
    rejectedAt: {
      type: DataTypes.DATE,
      field: "rejected_at",
    },
  },
  {
    underscored: true,
  }
);
