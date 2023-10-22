import { eventsRoute } from "./Routes/post/events";
import dbConnection from "./data-source";
import express from "express";
const app = express();
app.use(express.json());
app.use(eventsRoute);
dbConnection();

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
