import express, { Request, Response } from "express";
import { Register, Signin } from "../../entities/auth-entity";
import { dataSource } from "../../data-source";
import { HttpStatusCode } from "../../utils/status-code";
import { createJWT, hashPassword } from "../../utils/auth";

const register = express.Router();

interface userForm {
  fullName?: string;
  email?: string;
  username?: string;
  password?: string;
}

register.post("/register", async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  try {
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

    const username = email.split('@')[0];

    const register: userForm = {
      fullName,
      email,
      username,
    };

    const signin: userForm = {
      email,
      username,
      password: hashedPassword,
    };


    await source.manager.save(Register, register);
    await source.manager.save(Signin, signin);

    return res
      .status(HttpStatusCode.CREATED)
      .json({
        error: false,
        record: { username, created: "ok", fail: false, token },
      });

  } catch (e) {
    return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: true, record: { created: "unable to create" } });
  }

});

export default register;
