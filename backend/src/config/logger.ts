import { env } from './env.js';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function formatMessage(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  return JSON.stringify(entry);
}

export const logger = {
  info(message: string, meta?: Record<string, unknown>) {
    console.log(formatMessage('info', message, meta));
  },
  warn(message: string, meta?: Record<string, unknown>) {
    console.warn(formatMessage('warn', message, meta));
  },
  error(message: string, meta?: Record<string, unknown>) {
    console.error(formatMessage('error', message, meta));
  },
  debug(message: string, meta?: Record<string, unknown>) {
    if (env.isDevelopment) {
      console.debug(formatMessage('debug', message, meta));
    }
  },
};
