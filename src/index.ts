import router from "./Routes/post/events";
import auth from "./Routes/auth/auth";
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
app.use("/api-v1", auth);

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
