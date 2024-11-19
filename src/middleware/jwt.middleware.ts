import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ResponseService } from 'src/shared/services/response.service';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly responseService: ResponseService,
    private readonly authService: AuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        // Periksa apakah token sudah kadaluwarsa atau tidak
        const decoded = this.jwtService.verify(token);
        // Periksa apakah token sudah logout atau belum
        const isTokenInvalidated = await this.authService.isTokenInvalidated(token);
        if (isTokenInvalidated) {
          this.responseService.failed(res, 'Token invalidated', HttpStatus.UNAUTHORIZED);
        } else {
          req['user'] = decoded; // Lampirkan user yang didekode ke objek permintaan
          next();
        }
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          this.responseService.failed(res, 'Token expired', HttpStatus.UNAUTHORIZED);
        } else if (error.name === 'JsonWebTokenError') {
          this.responseService.failed(res, 'Invalid token', HttpStatus.UNAUTHORIZED);
        } else {
          this.responseService.failed(res, 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
    } else {
      this.responseService.failed(res, 'Missing or invalid authorization header', HttpStatus.UNAUTHORIZED);
    }
  }
}
