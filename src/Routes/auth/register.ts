import express, { Request, Response } from "express";
import { Register, Signin } from "../../entities/auth-entity";
import { dataSource } from "../../data-source";
import { HttpStatusCode } from "../../utils/status-code";
import { createJWT, hashPassword } from "../../utils/auth";
import { logger } from "../../utils/logger";

const register = express.Router();

interface userForm {
  user_id?: string;
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

    const user = await source.manager.save(Register, register);

    const signin: userForm = {
      user_id: user.user_id,
      email,
      username,
      password: hashedPassword,
    };

    await source.manager.save(Signin, signin);

    logger.info(`New user created \n 
      ${JSON.stringify({ record: { user_id: user.user_id, username, created: "ok", fail: false, token } }, null, " ")}`,
    )

    return res
      .status(HttpStatusCode.CREATED)
      .json({
        error: false,
        record: { user_id: user.user_id, username, created: "ok", fail: false, token },
      });

  } catch (e) {
    logger.error(`Error register \n`,
      JSON.stringify({ error: true, record: { created: "unable to create" } }, null, " ")
    )
    return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: true, record: { created: "unable to create" } });
  }

});

export default register;
