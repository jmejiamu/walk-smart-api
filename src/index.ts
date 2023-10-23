import { eventsRoute } from "./Routes/post/events";
import dbConnection from "./data-source";
import express from "express";
import { logger } from "./utils/logger";
const app = express();
app.use(express.json());
app.use(eventsRoute);
dbConnection();

const PORT = process.env.SERVER_PORT || 8080;

app.listen(PORT, () => {
  logger.info(`Server is listening on port ${PORT}`);
});
