import rateLimit from "express-rate-limit";
import { GenericCode } from "../utils/responseCodes";
import { failure } from "../utils/response";

export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: failure(
    GenericCode.TOO_MANY_REQUESTS,
    "Rate limit exceeded, please try again later."
  ),
  standardHeaders: true,
  legacyHeaders: false,
});
