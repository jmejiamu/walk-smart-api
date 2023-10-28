import express, { Request, Response } from "express";
import { Register, Signin } from "../../entities/auth-entity";
import { Event } from "../../entities/event-entity";
import { dataSource } from "../../data-source";
import { HttpStatusCode } from "../../utils/status-code";
import { createJWT, hashPassword } from "src/utils/auth";

const auth = express.Router();

interface userForm {
  fullName?: string;
  email?: string;
  password?: string;
}

auth.post("/register", async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  const source = dataSource;

  // Check if the user already exists.
  const userData = dataSource.getRepository(Register);
  const existingUser = await userData.findOne({ where: { email } });

  if (existingUser) {
    return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: true, record: { created: "user already exists" } });
  }

  const token = createJWT(email);
  const hashedPassword = await hashPassword(password);

  const register: userForm = {
    fullName,
    email,
    password: hashedPassword,
  };

  const signin: userForm = {
    email,
    password,
  };
  // NOTE: THIS IS A TESTS DATA USER LOCATION MUST BE INCLUDE IN THE REQUEST BODY
  const events = {
    latitude: "40.7128",
    longitude: "-122.0000",
    eventTitle: "hola",
    eventDescription: "mundo",
  };

  try {
    await source.manager.save(Register, register);
    await source.manager.save(Signin, signin);
    await source.manager.save(Event, events);
  } catch (e) {
    res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: true, record: { created: "unable to create" } });
    console.log(e);
  }
  res.status(HttpStatusCode.CREATED).json({
    error: false,
    record: { created: "ok", fail: false, token },
  });
});

export default auth;
