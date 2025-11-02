import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.DB_HOST ||
    !process.env.DB_PORT ||
    !process.env.DB_USERNAME ||
    !process.env.DB_PASSWORD ||
    !process.env.DB_NAME) {
  throw new Error("Missing required database environment variables");
}

export const data_source_options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [process.env.TYPEORM_ENTITIES ?? 'dist/**/*.entity.ts'],
  migrations: [process.env.TYPEORM_MIGRATIONS ?? 'dist/migrations/*.js'],
  synchronize: process.env.TYPEORM_SYNC === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',
};

export const data_source = new DataSource(data_source_options);
