import router from "./Routes/post/events";
import dbConnection from "./data-source";
import { logger } from "./utils/logger";
import express from "express";
import morgan from "morgan";
import cors from "cors";
const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use("/api-v1", router);
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

dbConnection();

const PORT = process.env.SERVER_PORT || 8080;

app.listen(PORT, () => {
  logger.info(`Server is listening on port ${PORT}`);
});
