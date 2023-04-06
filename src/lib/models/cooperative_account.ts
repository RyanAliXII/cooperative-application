import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";

export const CooperativeAccountModel = sequelize.define(
  "cooperative_account",
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
    cooperativeId: {
      type: DataTypes.UUID,
      field: "cooperative_id",
      references: {
        model: "cooperative",
        key: "id",
      },
    },
    isOwner: {
      type: DataTypes.BOOLEAN,
      field: "is_owner",
      defaultValue: false,
    },
  },
  {
    underscored: true,
  }
);
