import router from "./Routes/post/events";
import register from "./Routes/auth/register";
import signin from "./Routes/auth/signin";
import retriveEvents from "./Routes/post/retrive-events/retriveEvents";
import retriveEventsById from "./Routes/post/retrive-events-by-id/retriveEventsById";

import { logger } from "./utils/logger";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import { dataSource } from "./data-source";
import retrieveEventById from "./Routes/post/retrieve-event-by-id/retrieveEventById";
import retrieveUserEventsByID from "./Routes/post/retrieve-user-events-by-id/retrieveUserEvents";
import joinEvents from "./Routes/post/create-join-event/joinEvents";
import { verifyRoute } from "./Routes/verify/verify";

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api-v1", verifyRoute);
app.use("/api-v1", router);
app.use("/api-v1", register);
app.use("/api-v1", signin);
app.use("/api-v1", retriveEvents);
app.use("/api-v1", retriveEventsById);
app.use("/api-v1", retrieveEventById);
app.use("/api-v1", retrieveUserEventsByID);
app.use("/api-v1", joinEvents);

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

dataSource
  .initialize()
  .then(() => {
    logger.info("Data Source has been initialized!");
  })
  .catch((err) => {
    logger.error(
      `Error during Data Source initialization::file index.ts - root dir,
      ${err}`
    );
  });

const PORT = process.env.SERVER_PORT || 8080;

app.listen(PORT, () => {
  logger.info(`Server is listening on port ${PORT}`);
});
