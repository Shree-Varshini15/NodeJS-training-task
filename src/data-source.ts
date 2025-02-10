import 'reflect-metadata'
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV, TEST_DB_DATABASE } = process.env;

const options: DataSourceOptions & SeederOptions = {
  type: "postgres",
  host: DB_HOST || "localhost",
  port: parseInt(DB_PORT || "5432"),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: NODE_ENV === "test" ? TEST_DB_DATABASE : DB_DATABASE,
  synchronize: NODE_ENV === "development" ? false : false,
  logging: NODE_ENV === "development" ? true : false,
  entities: [path.join(__dirname, "databases/entity/**/*.{js,ts}")],
  migrations: [path.join(__dirname, "databases/migration/**/*.{js,ts}")],
  subscribers: [],
  factories: [path.join(__dirname, "databases/factories/**/*.{js,ts}")],
  seeds: [path.join(__dirname, "databases/seeds/**/*.{js,ts}")],
};
export const AppDataSource = new DataSource(options);

