import { Request, Response, Express, urlencoded } from "express";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import logger from "./utils/logger";
import { errorHandler } from "./middleware/ErrorHandler.middleware";
import { properties } from "./config/properties";
import {eventRoutes} from "./routes/event.route";
import { authRoutes } from "./routes/auth.routes";

const app: Express = express();

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message: any) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));
app.use(urlencoded({ extended: true, limit: "1mb" }));

const ALLOWED_ORIGINS: string[] = [
  properties.CLIENT_URL as string,
  "http://localhost:5173",
];

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  })
);

// Routes
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/auth",authRoutes)
// Health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running!" });
});

// Error handling middleware (should be last)
app.use(errorHandler);

export default app;
