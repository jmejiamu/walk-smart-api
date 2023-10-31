import router from "./Routes/post/events";
import register from "./Routes/auth/register";
import signin from "./Routes/auth/signin";
import retriveEvents from "./Routes/post/retrive-events/retriveEvents";
import retriveEventsById from "./Routes/post/retrive-events-by-id/retriveEventsById";
// import dbConnection from "./data-source";

import { logger } from "./utils/logger";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import { dataSource } from "./data-source";


const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api-v1", router);
app.use("/api-v1", register);
app.use("/api-v1", signin)
app.use('/api-v1', retriveEvents)
app.use('/api-v1', retriveEventsById)

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

dataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err)
  })


const PORT = process.env.SERVER_PORT || 8080;

app.listen(PORT, () => {
  logger.info(`Server is listening on port ${PORT}`);
});
