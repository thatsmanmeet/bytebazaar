import express from 'express';
import colors from 'colors';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { connectDB } from './db/dbConnect.js';
dotenv.config();

const port = process.env.PORT || 8003;
const app = express();

// security Middlewares
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: 'Too many requests from this IP address. Please try again later.',
    statusCode: 429,
    legacyHeaders: false,
  })
);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'device-remember-token',
      'Access-Control-Allow-Origin',
      'Origin',
      'Accept',
    ],
  })
);
app.use(helmet());
app.use(hpp());

// connect the database and put routes...
connectDB();
if (process.env.NODE_ENV === 'production') {
  // TODO
} else {
  app.get('/', (req, res) => {
    return res
      .status(200)
      .json({ status: 'OK', message: 'Development server is running...' });
  });
}

// request middlewares
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 404 Handler (always at the bottom)
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Route not found!',
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  res.json({
    status: err.statusCode || 500,
    success: false,
    data: null,
    message: err?.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
