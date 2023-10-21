import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

const dbConnection = async () => {
  const port = Number(process.env.PORT);

  try {
    const dataSource = new DataSource({
      type: "postgres",
      host: process.env.HOST,
      port: port,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
    });
    await dataSource.initialize();

    console.log("Connected to postgres db ....");
  } catch (error) {
    console.error(
      error,
      "File: data-source.ts - Unable to connect to postgres DB"
    );
  }
};

export default dbConnection;
