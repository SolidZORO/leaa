import path from 'path';
import winston from 'winston';

const DailyRotateFile = require('winston-daily-rotate-file');

const baseLog = (
  type: 'error' | 'warn' | 'info' | 'debug' | 'verbose',
  message: string,
  context?: string,
  trace?: string | any,
) => {
  const LOG_DIR_PATH = path.resolve(__dirname, '../../logs');

  const WINSTON_TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss';
  const WINSTON_INFO_FORMAT = winston.format.combine(
    winston.format.label(),
    winston.format.timestamp({ format: WINSTON_TIMESTAMP_FORMAT }),
    winston.format.printf((info: any) => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`),
  );

  const winstonLogger = winston.createLogger();

  winstonLogger.configure({
    level: 'verbose',
    format: WINSTON_INFO_FORMAT,
    transports: [
      new DailyRotateFile({
        filename: `${LOG_DIR_PATH}/app-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxSize: '50m',
        maxFiles: '3650d',
        level: 'verbose',
      }),
      new winston.transports.File({
        filename: `${LOG_DIR_PATH}/_error.log`,
        level: 'error',
      }),
    ],
  });

  let result = context ? `[${context}] ${message}` : `[ / ] ${message}`;

  if (trace) {
    result += `\n\n📍[ERROR-TRACE] ${trace}\n\n`;
  }

  return winstonLogger.log(type, result);
};

export const logger = {
  log: (message: string, context?: string) => baseLog('info', message, context),
  error: (message: string, context?: string, trace?: string) => baseLog('error', `❌ ${message}`, context, trace),
  warn: (message: string, context?: string) => baseLog('warn', `⚠️ ${message}`, context),
  debug: (message: string, context?: string) => baseLog('debug', message, context),
  verbose: (message: string, context?: string) => baseLog('verbose', message, context),
};
