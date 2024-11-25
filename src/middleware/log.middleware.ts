import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '../shared/services/logger.service';
import { LogService } from 'src/app/log/log.service';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  constructor(
   private readonly logger: Logger,
   private readonly logService: LogService,
) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();

    const originalSend = res.send.bind(res);
    let responseBody: any;

    res.send = (body: any) => {
      responseBody = body;
      return originalSend(body);
    };

    res.on('finish', () => {
      const responseTime = Date.now() - start;
      const logEntry = {
        url: originalUrl,
        method,
        ip: req.ip,
        user: req.user || null,
        body: req.body,
        statusCode: res.statusCode,
        response: responseBody,
        responseTime,
      };

      this.logger.log(JSON.stringify(logEntry));

      // Simpan log ke MongoDB
      this.logService.saveLog(logEntry);
    });

    next();
  }
}
