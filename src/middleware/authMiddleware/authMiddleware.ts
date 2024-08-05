import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../utils/status-code";
import jwt from "jsonwebtoken";

interface middlewareHeader {
  req: Request;
  res: Response;
  next: NextFunction;
}

export const authMiddleware = ({ req, res, next }: middlewareHeader) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).email = (decoded as any).email;
    next();
  } catch (error) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: "Unauthorized",
    });
  }
};
