import jwt from "jsonwebtoken";
import { HttpStatusCode } from "./status-code";
import bcrypt from "bcrypt";

interface IUser {
  email: string;
}

export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};

export const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hash(password, salt);
};
export const createJWT = (email: IUser) => {
  const secretJWT = process.env.JWT_SECRET as string;
  const token = jwt.sign(
    {
      email,
    },
    secretJWT
  );
  return token;
};

// This is protecting the routes
export const protect = (req: any, res: any, next: any) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json({ message: "You need to login" });
  }

  const [, token] = bearer.split(" ");
  if (!token) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json({ message: "Not valid token" });
  }
  try {
    const secretJWT = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secretJWT);
    // This may need to change
    req.body.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid token - You need to login" });
  }
};
