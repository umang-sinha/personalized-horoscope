import { z } from "zod";
import dotenv from "dotenv";
import { logger } from "../utils/logger";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.coerce.number().default(3000),
  POSTGRES_URL: z.url(),
  JWT_SECRET: z.string().min(1),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  logger.error(`Invalid environment variables: ${_env.error}`);
  process.exit(1);
}

export const env = _env.data;
