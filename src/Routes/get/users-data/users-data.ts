import express, { Request, Response } from "express";
import { HttpStatusCode } from "../../../utils/status-code";
import jwt from "jsonwebtoken";
import { dataSource } from "../../../data-source";
import { Register } from "../../../entities/auth-entity";

export const usersData = express.Router();

interface userData {
  email: string;
}

usersData.get("/users-data", async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  }

  const source = dataSource;

  try {
    const userData = source.getRepository(Register);
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const userEmail = decoded as userData;
    const userInfo = await userData.findOne({
      where: { email: userEmail.email },
    });
    return res.status(HttpStatusCode.OK).json({
      message: "verified",
      error: false,
      status: HttpStatusCode.OK,
      isVerify: true,
      userInfo,
    });
  } catch (error) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json({ message: "Invalid token" });
  }
});
