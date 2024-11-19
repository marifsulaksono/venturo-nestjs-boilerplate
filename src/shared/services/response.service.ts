import { Injectable, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class ResponseService {
  success(res: Response, data: any = [], message: string = '', settings: any = {}): void {
    res.status(HttpStatus.OK).json({
      status_code: HttpStatus.OK,
      data: data,
      message: message,
      settings: settings,
    });
  }

  failed(res: Response, error: any = [], httpCode: number = HttpStatus.UNPROCESSABLE_ENTITY, settings: any = {}): void {

    let arrError: any[] = [];
    if (Array.isArray(error)) {
      arrError = error;
    } else {
      arrError[0]= error
    }

    res.status(httpCode).json({
      status_code: httpCode,
      errors: arrError,
      settings: settings,
    });
  }
}
