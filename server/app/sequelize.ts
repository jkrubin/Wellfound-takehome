import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { User } from "../models/user";
import dotenv from "dotenv";
import { Candidate } from "../models/candidate";
import { Applicant, Listing } from "../models/listing";
dotenv.config();
const env = process.env.NODE_ENV || "development";

const config: SequelizeOptions = {
  username: process.env.DB_USER || "wellfound",
  password: process.env.DB_PASS || "wellfound",
  database: process.env.DB_NAME || "wellfound",
  host: process.env.DB_HOST || "127.0.0.1",
  port: 5432,
  dialect: "postgres",
};

const models = [User, Candidate, Listing, Applicant];

const sequelize = new Sequelize({
  ...config,
});

sequelize.addModels(models);

export { sequelize };
