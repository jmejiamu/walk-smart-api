import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();
import { Events, EventsLocations, JoinedEvents } from "./entities/event-entity";
// import { logger } from "./utils/logger"; // uncomment use for your connection
import { Register, Signin } from "./entities/auth-entity";

// NOTE: connection setting url reference --> https://orkhan.gitbook.io/typeorm/docs/data-source

const port = Number(process.env.PORT);

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.HOST,
  port: port,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  entities: [
    Register,
    Signin,
    Events,
    EventsLocations,
    JoinedEvents,
  ],
  synchronize: true,
});


// **** Note use this for your connection ****

// export const dbConnection = async () => {
//   const port = Number(process.env.PORT);

//   try {
//     const dataSource = new DataSource({
//       type: "postgres",
//       host: process.env.HOST,
//       port: port,
//       username: process.env.USERNAME,
//       password: process.env.PASSWORD,
//       database: process.env.DATABASE,
//       entities: [Event, Register],
//       synchronize: true,
//     });
//     logger.info("set connection and database.")
//     // logger.info("Connected to postgres db ....");
//    const source = await dataSource;
//     return source;
//   } catch (error) {
//     console.error(
//       error,
//       "File: data-source.ts - Unable to connect to postgres DB"
//     );
//     throw new Error("Unable to connect to the Database");
//   }
// };

// export default dbConnection;
