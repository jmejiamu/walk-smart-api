import express, { Request, Response } from "express";
import { dataSource } from "../../../data-source";
import { logger } from "../../../utils/logger";
import { HttpStatusCode } from "../../../utils/status-code";

const retrieveEventById = express.Router();

retrieveEventById.get("/events/event", async (req: Request, res: Response) => {
  // http://localhost:8080/api-v1/events/event?event_id=9b168284-9da9-43ee-9546-231a9d0a9e51

  const event_id = req.query.event_id;

  try {
    const event = await dataSource.query(
      `SELECT
        e.event_id, 
        e.user_id,
        e.user_name,
        e.event_title,
        e.event_description,
        el.latitude,
        el.longitude,
        el.time_stamp,
        jc.user_id,
        jc.event_id,
        COALESCE(NULL, jc.counter, 0) AS joined_users
    FROM events AS e
    RIGHT JOIN events_location AS el
    ON e.event_id = el.event_id
    LEFT JOIN joined_counter AS jc
    ON jc.event_id = e.event_id
    WHERE e.event_id = $1`,
      [event_id]
    );

    logger.info(`users event \n${JSON.stringify(event, null, " ")}`);

    // console.log(event[0].joi:w);

    return res.status(HttpStatusCode.OK).json({
      error: false,
      recived: "ok",
      joined_users: event[0].joined_users,
      event_id,
      event,
    });
  } catch (error) {
    logger.error(
      `error \n ${JSON.stringify(
        { error: true, message: "bad request" },
        null,
        " "
      )}`
    );
    return res
      .status(HttpStatusCode.NOT_FOUND)
      .json({ error: true, message: "bad request" });
  }
});

export default retrieveEventById;
