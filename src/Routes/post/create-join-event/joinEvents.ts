import express, { Request, Response } from "express";
import { HttpStatusCode } from "../../../utils/status-code";
import { dataSource } from "../../../data-source";
import { JoinedEvent, JoinCounter } from "../../../models/interfaces";
import {
  Events,
  JoinedCounter,
  JoinedEvents,
} from "../../../entities/event-entity";
import { logger } from "../../../utils/logger";
import { Signin } from "../../../entities/auth-entity";

const joinEvents = express.Router();

joinEvents
  .post("/join", async (req: Request, res: Response) => {
    // user_id want to event_id created_by_id (user_id) -- url query
    // http://localhost:8080/api-v1/join?user_id=9b168284-9da9-43ee-9546-231a9d0a9e51&event_id=9b168284-9da9-43ee-9546-231a9d0a9e51&created_by_id=49907249-6274-420e-b81e-a2ed722024a9

    const { user_id, event_id } = req.query;

    try {
      const source = dataSource;

      // We can use this if the user has joined already.
      const eventData = source.getRepository(JoinedEvents);
      const event = await eventData.findOne({
        where: {
          user_id: String(user_id),
          event_id: String(event_id),
        },
      });

      // check  with user_id and event id if event exist
      const createdEvents = await source.getRepository(Events).findOne({
        where: {
          event_id: String(event_id),
        },
      });

      if (createdEvents === null) {
        return res
          .status(HttpStatusCode.OK)
          .json({ message: "event was not found" });
      }

      // Get the counter to be updated
      const joinedCounter = await source.getRepository(JoinedCounter).findOne({
        where: {
          event_id: String(event_id),
        },
      });
      console.log("🚀 ~ joinedCounter ~ joinedCounter:", joinedCounter);

      if (event?.joined) {
        return res
          .status(HttpStatusCode.OK)
          .json({ joined: true, message: "YOU ALREADY JOIN THIS EVENT" });
      }

      const userData = dataSource.getRepository(Signin);
      const user = await userData.findOne({
        where: { user_id: user_id?.toString() },
      });

      let join: JoinedEvent = {};
      let counter: JoinCounter = {};

      // first user to join the event
      if (joinedCounter === null || joinedCounter?.counter < 1) {
        join.user_id = String(user_id);
        join.event_id = String(event_id);
        join.joined = true;
        join.user_name = user?.username;

        counter.user_id = String(user_id);
        counter.event_id = String(event_id);
        counter.counter = 1;

        await source.manager.save(JoinedEvents, join);
        await source.manager.save(JoinedCounter, counter);
      } else if (joinedCounter.counter >= 1) {
        join.user_id = String(user_id);
        join.event_id = String(event_id);
        join.joined = true;
        join.user_name = user?.username;

        counter.counter = joinedCounter!.counter + 1;
        counter.event_id = joinedCounter.event_id;
        counter.user_id = joinedCounter.user_id;

        await source.manager.save(JoinedEvents, join);
        await source.manager
          .createQueryBuilder()
          .update(JoinedCounter)
          .set({
            counter: () => "counter + 1",
          })
          .where("event_id = :event_id", {
            event_id: event_id,
          })
          .execute();
      }

      return res.status(HttpStatusCode.OK).json({ join: true, event: join });
    } catch (error) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ error: true, record: { created: "unable to create" } });
    }
  })
  .get("/join", async (req: Request, res: Response) => {
    // http://localhost:8080/api-v1/join?user_id=9b168284-9da9-43ee-9546-231a9d0a9e51
    const { user_id } = req.query;

    try {
      const source = dataSource;
      const joinedEvents = await source.query(
        `SELECT 
                        je.user_id,
                        je.event_id,
                        je.user_name,
                        e.event_title,
                        e.event_description,
                        el.latitude,
                        el.longitude,
                        e.time_stamp,
                        jec.counter
                FROM joined_events AS je
                JOIN events AS e ON je.event_id = e.event_id
                JOIN events_location AS el ON je.event_id = el.event_id
                JOIN joined_counter AS jec ON je.event_id = jec.event_id
                WHERE je.user_id = $1`,
        [user_id]
      );

      return res
        .status(HttpStatusCode.OK)
        .json({ error: false, recived: "ok", events: joinedEvents });
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

export default joinEvents;
