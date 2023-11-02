import express, { Request, Response } from "express";
import { dataSource } from "../../../data-source";
import { Events } from "src/models/interfaces";
import { HttpStatusCode } from "../../../utils/status-code";
import { logger } from "../../../utils/logger";


const retriveEvents = express.Router();

retriveEvents.get("/events/all", async (_: Request, res: Response) => {

    try {
        const events = await dataSource.query<Events>(`SELECT 
                DISTINCT ON (e.event_id)
                e.event_id, 
                e.user_id,
                e.event_title,
                e.event_description,
                el.latitude,
                el.longitude,
                el.time_stamp
            FROM events AS e
            JOIN events_location AS el
            ON e.user_id = el.user_id
            ORDER BY e.event_id`
        )
        logger.info(`All events \n ${JSON.stringify(events, null, " ")}`)
        return res
            .status(HttpStatusCode.OK)
            .json({
                error: false,
                message: "all events",
                events
            })

    } catch (error) {
        return res
            .status(HttpStatusCode.INTERNAL_SERVER)
            .json({
                error: true,
                message: "unable to fetch events"
            })
    }

})

export default retriveEvents;