import express from "express";
import colors from "colors";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import hpp from "hpp";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { connectDB } from "./db/dbConnect.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";
import uploadRouter from "./routes/upload.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";
import logger from "./utils/logger.js";
import morgan from "morgan";
dotenv.config();

const port = process.env.PORT || 8003;
const morganFormat =
  ":remote-addr :method :url :status :response-time ms :user-agent";
const app = express();

// security Middlewares
morgan.token("user-agent", function (req) {
  return req.headers["user-agent"];
});

if (process.env.NODE_ENV === "development") {
  app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          // Split message by space, preserving user-agent as the last chunk
          const parts = message.trim().split(" ");
          const responseTimeIndex = parts.findIndex((part) =>
            part.endsWith("ms"),
          );

          const logObject = {
            ip: parts[0],
            method: parts[1],
            url: parts[2],
            status: parts[3],
            responseTime: parts[responseTimeIndex],
            userAgent: parts.slice(responseTimeIndex + 1).join(" "),
          };

          logger.info(JSON.stringify(logObject));
        },
      },
    }),
  );
}

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: process.env.RATE_LIMIT_REQUEST,
    message: "Too many requests from this IP address. Please try again later.",
    statusCode: 429,
    legacyHeaders: false,
  }),
);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "device-remember-token",
      "Access-Control-Allow-Origin",
      "Origin",
      "Accept",
    ],
  }),
);
app.use(helmet());
app.use(hpp());

// request middlewares
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// connect the database and put routes...
connectDB();
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/uploads", uploadRouter);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    return res
      .status(200)
      .json({ status: "OK", message: "Development server is running..." });
  });
}

// 404 Handler (always at the bottom)
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: "Route not found!",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  res.json({
    status: err.statusCode || 500,
    success: false,
    data: null,
    message: err?.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
