import express from "express";
import { Event } from "../../../entities/event-entity";
import { logger } from "../../../utils/logger";
import { HttpStatusCode } from "../../../utils/status-code";

const router = express.Router();

router.post("/events", async (req, res) => {
  try {
    const { latitude, longitude, eventTitle, eventDescription, timeStamp } =
      req.body;
    const event = Event.create({
      latitude,
      longitude,
      eventTitle,
      eventDescription,
      timeStamp,
    });
    await event.save();
    res.status(HttpStatusCode.OK).json({ message: "Event saved" });
  } catch (error) {
    logger.error(error);
    res
      .status(HttpStatusCode.INTERNAL_SERVER)
      .json({ message: "Internal server error" });
  }
});

export default router;
