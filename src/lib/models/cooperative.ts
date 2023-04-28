import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";

export const CooperativeModel = sequelize.define(
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
    registrationDate: {
      type: DataTypes.DATEONLY,
    },
    categoryId: {
      type: DataTypes.UUID,
      references: {
        model: "cooperative_category",
        key: "id",
      },
    },
  },
  {
    underscored: true,
  }
);
