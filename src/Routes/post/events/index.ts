import express from "express";
import { Events, EventsLocations } from "../../../entities/event-entity";
import { Event, EventLocation } from "../../../models/interfaces";
import { dataSource } from "../../../data-source";
import { logger } from "../../../utils/logger";
import { HttpStatusCode } from "../../../utils/status-code";

const router = express.Router();

router.post("/events", async (req, res) => {
  const { user_id, latitude, longitude, event_title, event_description, timeStamp } = req.body;

  try {
    const source = dataSource;

    const newEvent: Event = {
      user_id: user_id,
      event_title: event_title,
      event_description: event_description,
      time_stamp: timeStamp,
    }

    const event = await source.manager.save(Events, newEvent)

    const eventLocation: EventLocation = {
      user_id: user_id,
      event_id: event.event_id,
      latitude: latitude,
      longitude: longitude,
      time_stamp: timeStamp
    }

    const locationCoors = await source.manager.save(EventsLocations, eventLocation)

    logger.info(`new event \n 
        ${JSON.stringify({ event: { event, locationCoors } }, null, " ")}`
    )

    return res
      .status(HttpStatusCode.OK)
      .json({
        error: false,
        created: true,
        message: "Event saved",
        event: {
          event,
          locationCoors,
        }
      });

  } catch (error) {
    logger.error(error);
    return res
      .status(HttpStatusCode.INTERNAL_SERVER)
      .json({ message: "Internal server error" });
  }

});

export default router;
