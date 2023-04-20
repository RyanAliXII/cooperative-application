import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";

export const AccountModel = sequelize.define(
  "account",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    givenName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "given_name",
    },
    middleName: {
      type: DataTypes.STRING,
      field: "middle_name",
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "surname",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "email",
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "password",
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
