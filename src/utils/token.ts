import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function generateToken(userId: number) {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "1d" });
}
