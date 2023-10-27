import express, { Request, Response } from "express";
import { Register, Signin } from "../../entities/auth-entity";
import { Event } from "../../entities/event-entity";
import { dataSource } from "../../data-source";
import { HttpStatusCode } from "../../utils/status-code";

const auth = express.Router();

interface userForm {
    fullName?: string;
    email?: string;
    password?: string;
}

auth.post("/register", async (req: Request, res: Response) => {

    const { fullName, email, password } = req.body


    const register: userForm = {
        fullName,
        email,
        password
    }

    const signin: userForm = {
        email,
        password
    }
    // NOTE: THIS IS A TESTS DATA USER LOCATION MUST BE INCLUDE IN THE REQUEST BODY
    const events = { latitude: "40.7128", longitude: "-122.0000", eventTitle: "hola", eventDescription: "mundo" }
    
    const source = dataSource;

    try {
        await source.manager.save(Register, register)
        await source.manager.save(Signin, signin)
        await source.manager.save(Event, events)

    } catch (e) {
        res.status(HttpStatusCode.BAD_REQUEST).json({error: true, record: {created: "unable to create"}})
        console.log(e);
    }
    res.status(HttpStatusCode.CREATED).json({error : false, record : {created: "ok", fail : false, token :"TOKE-HERE"}})

})

export default auth;