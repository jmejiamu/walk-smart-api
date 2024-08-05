import express, { Request, Response } from "express";
import { HttpStatusCode } from "../../utils/status-code";
import { authMiddleware } from "../../middleware";

export const verifyRoute = express.Router();

verifyRoute.get(
  "/verify",
  authMiddleware,
  async (_: Request, res: Response) => {
    try {
      res.status(HttpStatusCode.OK).json({
        message: "verified",
        error: false,
        status: HttpStatusCode.OK,
        isVerify: true,
      });
    } catch (error) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({
        message: "Internal Server Error",
        error: true,
        status: HttpStatusCode.UNAUTHORIZED,
      });
    }
  }
);
