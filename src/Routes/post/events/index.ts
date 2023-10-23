import express from "express";
import { Event } from "../../../entities/event-entity";

const router = express.Router();

router.post("/api-v1/events", async (req, res) => {
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
    res.status(200).json({ message: "Event saved" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Internal server error" });
  }
});

export { router as eventsRoute };
