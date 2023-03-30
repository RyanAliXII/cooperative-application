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

export const Member = sequelize.define(
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
    civilStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "civil_status",
    },
    spouseName: {
      type: DataTypes.STRING,
      field: "spouse_name",
    },
    presentAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "present_address",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: false,
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
export const Session = sequelize.define(
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
    expiresAt: {
      type: DataTypes.DATE,
      field: "expires_at",
    },
  },
  {
    underscored: true,
  }
);
export const Account = sequelize.define(
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

CooperativeAccount.belongsTo(Cooperative, { foreignKey: "cooperative_id" });
