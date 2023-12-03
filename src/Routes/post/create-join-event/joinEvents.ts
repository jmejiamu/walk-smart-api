import express, { Request, Response } from "express";
import { HttpStatusCode } from "../../../utils/status-code";
import { dataSource } from "../../../data-source";
import { JoinedEvent } from "../../../models/interfaces";
import { JoinedEvents } from "../../../entities/event-entity";
import { logger } from "../../../utils/logger";

const joinEvents = express.Router();

joinEvents.post("/join", async (req: Request, res: Response) => {

    // http://localhost:8080/api-v1/join?user_id=9b168284-9da9-43ee-9546-231a9d0a9e51&event_id=9b168284-9da9-43ee-9546-231a9d0a9e51
    const { user_id, event_id } = req.query

    try {
        const source = dataSource;

        const eventData = source.getRepository(JoinedEvents)
        const event = await eventData.findOne({
            where: {
                user_id: String(user_id),
                event_id: String(event_id)
            }
        })


        if (event?.joined) {
            return res.status(HttpStatusCode.BAD_REQUEST)
                .json({ joined: true, message: "YOU ALREADY JOIN THIS EVENT" })
        }

        const join: JoinedEvent = {
            user_id: String(user_id),
            event_id: String(event_id),
            joined: true
        }

        await source.manager.save(JoinedEvents, join)

        return res.status(HttpStatusCode.CREATED)
            .json({ join: true, event: join })


    } catch (error) {
        return res
            .status(HttpStatusCode.BAD_REQUEST)
            .json({ error: true, record: { created: "unable to create" } });
    }


})
    .get("/join", async (req: Request, res: Response) => {
        // http://localhost:8080/api-v1/join?user_id=9b168284-9da9-43ee-9546-231a9d0a9e51
        const { user_id } = req.query

        try {
            const source = dataSource
            const joinedEvents = await source.query(`SELECT 
                        je.user_id,
                        je.event_id,
                        e.event_title,
                        e.event_description,
                        el.latitude,
                        el.longitude,
                        e.time_stamp
                FROM joined_events AS je
                JOIN events AS e ON je.event_id = e.event_id
                JOIN events_location AS el ON je.event_id = el.event_id
                WHERE je.user_id = $1`, [user_id])

            return res
                .status(HttpStatusCode.OK)
                .json({ error: false, recived: "ok", events: joinedEvents })

        } catch (error) {
            logger.error(`error \n ${JSON.stringify({ error: true, message: "bad request" }, null, " ")}`)
            return res
                .status(HttpStatusCode.NOT_FOUND)
                .json({ error: true, message: "bad request" })
        }
    })


export default joinEvents