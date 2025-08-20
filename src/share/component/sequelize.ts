import { config } from "dotenv";
import { Sequelize } from "sequelize";
config();
export const sequelize = new Sequelize({
  database: process.env.DB_NAME || "",
  username: process.env.DB_USER || "",
  password: process.env.DB_PASS || "",
  host: process.env.DB_HOST || "",
  port: parseInt((process.env.DB_PORT as string) || "3306", 10),
  dialect: "mysql",
  pool: {
    max: 20,
    min: 2,
    acquire: 30000,
    idle: 60000,
  },
  logging: true,
});
