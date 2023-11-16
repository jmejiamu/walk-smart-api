import express, { Request, Response } from "express";
import { HttpStatusCode } from "../../../utils/status-code";
import { dataSource } from "../../../data-source";
import { logger } from "../../../utils/logger";



const retriveEventsById = express.Router();
// retrieve all events creacted by user.
// Get all events by user uuid
retriveEventsById.get("/events/me", async (req: Request, res: Response) => {
    
    // http://localhost:8080/api-v1/events/me?user_id=026ed160-99b1-4427-92ab-4286ce51fb3f
    
    const user_id = req.query.user_id;

    try {
        const events = await dataSource.query(`SELECT
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