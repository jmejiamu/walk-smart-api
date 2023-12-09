import express, { Request, Response } from "express";
import { dataSource } from "../../../data-source";
import { logger } from "../../../utils/logger";
import { HttpStatusCode } from "../../../utils/status-code";


const retrieveUserEventsByID = express.Router();
//  I dont need this route?
retrieveUserEventsByID.get('/events/all/me', async (req: Request, res: Response) => {

    // http://localhost:8080/api-v1/events/all/me?user_id=qwqsa-sadjaskl-dsakdjsk-53ww

    const user_id = req.query.user_id

    try {
        const myEvents = await dataSource.query(`SELECT
                DISTINCT ON (e.event_id)
                e.event_id, 
                e.user_id,
                e.event_title,
                e.event_description,
                el.latitude,
                el.longitude,
                el.time_stamp
            FROM public.events AS e
            JOIN public.events_location AS el
            ON e.user_id = el.user_id
            WHERE e.user_id = $1
            ORDER By e.event_id`, [user_id])

        logger.info(`users event \n${JSON.stringify(myEvents, null, " ")}`)

        return res
            .status(HttpStatusCode.OK)
            .json({ error: false, recived: "ok", user_id, myEvents })

    } catch (error) {
        logger.error(`error \n ${JSON.stringify({ error: true, message: "bad request" }, null, " ")}`)
        return res
            .status(HttpStatusCode.NOT_FOUND)
            .json({ error: true, message: "bad request" })
    }
})

export default retrieveUserEventsByID;