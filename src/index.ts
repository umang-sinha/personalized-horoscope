import express from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { sequelize } from "./db";
import "./models/User";
import "./models/Horoscope";
import "./models/index";
import authRoutes from "./routes/auth";
import horoscopeRutes from "./routes/horoscope";
import { apiRateLimiter } from "./middlewares/rateLimit";
import { requireAuth } from "./middlewares/requireAuth";
import { setupSwagger } from "./swagger";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use("/auth", apiRateLimiter, authRoutes);
app.use("/horoscope", apiRateLimiter, requireAuth, horoscopeRutes);

const PORT = env.PORT;

setupSwagger(app);

let server: ReturnType<typeof app.listen>;

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    server = app.listen(PORT, () => {
      logger.info(`Server listening at port: ${PORT}`);
    });
  } catch (err) {
    logger.error(`Failed to connect to DB: ${err}`);
    process.exit(1);
  }
}

async function shutdown(signal: string) {
  logger.info(`${signal} received. Closing server.`);

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    await sequelize.close();
    logger.info("Shutdown complete. Goodbye");
    process.exit(0);
  } catch (err) {
    logger.error("Error during shutdown: " + err);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();
