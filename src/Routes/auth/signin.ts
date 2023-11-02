import express, { Request, Response } from "express";
import { dataSource } from "../../data-source";
import { Signin } from "../../entities/auth-entity";
import { HttpStatusCode } from "../../utils/status-code";
import { comparePassword, createJWT } from "../../utils/auth";
import { logger } from "../../utils/logger";

const signin = express.Router();

signin.post("/signin", async (req: Request, res: Response) => {

    const { email, password } = req.body

    try {
        const source = dataSource.getRepository(Signin);
        const user = await source.findOne({ where: { email } });

        if (!user) {
            return res
                .status(HttpStatusCode.NOT_FOUND)
                .json({ error: true, record: { message: "not found" } });
        }

        const ok = comparePassword(password, user.password)
        if (!ok) {
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .json({ error: true, record: { message: "wrong email or password" } });
        }

        const token = createJWT(email);

        logger.info(`New signin \n 
            ${JSON.stringify({ record: { user_id: user.user_id, username: user.username, fail: false, token } }, null, " ")}`
        )

        return res
            .status(HttpStatusCode.OK)
            .json({
                error: false,
                record: { user_id: user.user_id, username: user.username, fail: false, token },
            });

    } catch (error) {
        logger.error(`error signin \n
            ${JSON.stringify({ error: true, record: { created: "unable to create" } }, null, " ")}`
        )
        return res
            .status(HttpStatusCode.BAD_REQUEST)
            .json({ error: true, record: { created: "unable to create" } });
    }

})

export default signin;