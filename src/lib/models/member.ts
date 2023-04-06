import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";
export const MemberModel = sequelize.define(
  "member",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    givenName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "given_name",
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "middle_name",
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "surname",
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "birthday",
    },
    gender: {
      type: DataTypes.STRING,
    },
    civilStatus: {
      type: DataTypes.STRING,

      field: "civil_status",
    },
    spouseName: {
      type: DataTypes.STRING,
      field: "spouse_name",
    },
    educationalAttainment: {
      type: DataTypes.STRING,
      field: "educational_attainment",
    },
    presentAddress: {
      type: DataTypes.TEXT,
      field: "present_address",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      field: "mobile_number",
    },
    officePhoneNumber: {
      type: DataTypes.STRING,
      field: "office_phone_number",
    },
    dependents: {
      type: DataTypes.JSONB,
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
