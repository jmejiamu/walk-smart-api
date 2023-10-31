import express, { Request, Response } from "express";
import { HttpStatusCode } from "../../../utils/status-code";
import { dataSource } from "../../../data-source";
import { Events } from "../../../models/interfaces";
import { logger } from "../../../utils/logger";



const retriveEventsById = express.Router();

retriveEventsById.get("/events/me", async (req: Request, res: Response) => {

    const user_id = req.query.user_id;

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
            WHERE e.user_id = $1
            ORDER BY e.event_id ASC`, [user_id]);
        
        logger.info(`users events \n${JSON.stringify(events, null, " ")}`)

        return res
                .status(HttpStatusCode.OK)
                .json({error: false, recived : "ok", user_id, events})

    } catch (error) {
        logger.error(`error \n ${JSON.stringify({error: true, message : "bad request"}, null, " ")}`)
        return res
            .status(HttpStatusCode.NOT_FOUND)
            .json({error: true, message : "bad request"})
    }

})


export default retriveEventsById;