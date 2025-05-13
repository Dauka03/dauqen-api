import winston from 'winston';
import path from 'path';
import { format } from 'winston';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Add colors to winston
winston.addColors(colors);

// Define log format
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  format.colorize({ all: true }),
  format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define log format for files
const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define log directory
const logDir = path.join(process.cwd(), 'logs');

// Create logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels,
  format: logFormat,
  transports: [
    // Console transport
    new winston.transports.Console(),
    // Error log file transport
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: fileFormat,
    }),
    // Combined log file transport
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: fileFormat,
    }),
  ],
});

// Create stream for Morgan
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Log levels
export const logLevels = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  HTTP: 'http',
  DEBUG: 'debug',
} as const;

// Log functions
export const logError = (message: string, meta?: any) => {
  logger.error(message, { ...meta });
};

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, { ...meta });
};

export const logInfo = (message: string, meta?: any) => {
  logger.info(message, { ...meta });
};

export const logHttp = (message: string, meta?: any) => {
  logger.http(message, { ...meta });
};

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, { ...meta });
};

// Request logger middleware
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;
    logHttp(message, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  });

  next();
};

// Error logger middleware
export const errorLogger = (err: any, req: any, res: any, next: any) => {
  logError(err.message, {
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    params: req.params,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  next(err);
};

// Performance logger
export const logPerformance = (operation: string, duration: number) => {
  logInfo(`Performance: ${operation} took ${duration}ms`, {
    operation,
    duration,
  });
};

// Database logger
export const logDatabase = (operation: string, details: any) => {
  logInfo(`Database: ${operation}`, {
    operation,
    ...details,
  });
};

// Security logger
export const logSecurity = (event: string, details: any) => {
  logWarn(`Security: ${event}`, {
    event,
    ...details,
  });
};

// API logger
export const logApi = (method: string, url: string, status: number, duration: number) => {
  logHttp(`${method} ${url} ${status} ${duration}ms`, {
    method,
    url,
    status,
    duration,
  });
};

export default {
  logger,
  stream,
  logLevels,
  logError,
  logWarn,
  logInfo,
  logHttp,
  logDebug,
  requestLogger,
  errorLogger,
  logPerformance,
  logDatabase,
  logSecurity,
  logApi,
}; 