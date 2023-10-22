import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();
import { Event } from "./entities/event-entity";

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
      entities: [Event],
      synchronize: true,
    });
    await dataSource.initialize();

    console.log("Connected to postgres db ....");
  } catch (error) {
    console.error(
      error,
      "File: data-source.ts - Unable to connect to postgres DB"
    );
    throw new Error("Unable to connect to the Database");
  }
};

export default dbConnection;
