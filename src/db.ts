import { Sequelize } from "sequelize";
import { env } from "./config/env";

export const sequelize = new Sequelize(env.POSTGRES_URL, {
  dialect: "postgres",
  logging: false,
});
