import { Sequelize } from "sequelize";
// import * as dotenv from "dotenv";

import {
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_HOST,
  DB_USERNAME,
} from "$env/static/private";
export const sequelize = new Sequelize({
  host: DB_HOST,
  port: parseInt(DB_PORT ?? "") ?? 5432,
  database: DB_NAME,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  dialect: "postgres",
  define: {
    freezeTableName: true,
  },
});
