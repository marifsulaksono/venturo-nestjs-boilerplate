import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class Logger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    const logTransport = new DailyRotateFile({
      filename: './logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '30d',
    });

    const consoleTransport = new winston.transports.Console({
      format: winston.format.simple(),
      silent: process.env.NODE_ENV === 'production'
    });

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        logTransport,
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(message, { trace });
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
