import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../models/User";
import { failure } from "../utils/response";
import { AuthCode } from "../utils/responseCodes";

interface AuthPayload {
  userId: string;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json(
        failure(
          AuthCode.UNAUTHORIZED,
          "Missing or invalid Authorization header"
        )
      );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res
        .status(401)
        .json(failure(AuthCode.USER_NOT_FOUND, "User not found for token"));
    }

    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json(failure(AuthCode.INVALID_TOKEN, "Invalid or expired token"));
  }
};
