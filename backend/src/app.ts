import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiRouter } from './routes/api.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { env } from './config/env.js';

export const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API v1 prefix
app.use('/api/v1', apiRouter);

// Centralized error handler
app.use(errorHandler);
