import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";

export const Cooperative = sequelize.define(
  "cooperative",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    registrationNumber: {
      type: DataTypes.STRING,
      field: "registration_number",
    },
    initials: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    province: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
  },
  {
    underscored: true,
  }
);

export const CooperativeAccount = sequelize.define(
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
  },
  {
    underscored: true,
  }
);

CooperativeAccount.belongsTo(Cooperative, { foreignKey: "cooperative_id" });
