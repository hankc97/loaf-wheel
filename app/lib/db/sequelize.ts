import { config } from "dotenv";
import pg from "pg";
import { Sequelize } from "sequelize-typescript";
import { Log } from "../logging/logging";
import { WheelModel } from "./models/wheel";
import { WheelDetailsModel } from "./models/wheelDetails";
import { WheelSnapShotModel } from "./models/wheelSnapShot";

config();

const logger = new Log("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URI!, {
  models: [WheelModel, WheelDetailsModel, WheelSnapShotModel],
  logging: (sql: string, timing?: number) =>
    logger.debug(`${sql} (${timing}ms)`),
  dialect: "postgres",
  dialectModule: pg,
  retry: {
    // Error types: https://sequelize.org/api/v6/identifiers.html#errors
    match: [
      /ConnectionError/, // Fix pg vercel bug: https://github.com/orgs/vercel/discussions/234
    ],
    max: 3,
  },
});

export default sequelize;
