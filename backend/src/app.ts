import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiRouter } from './routes/api.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { env } from './config/env.js';

export const app = express();

const allowedOrigins = env.CORS_ORIGIN.split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// Security and utility middlewares
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API v1 prefix
app.use('/api/v1', apiRouter);

// Centralized error handler
app.use(errorHandler);
