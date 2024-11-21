import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { config } from 'dotenv';
config();

import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private authService: AuthService,
        private reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
    
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('Token not found');
        }
    
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
    
            // Check if token is invalidated
            const isTokenInvalidated = await this.authService.isTokenInvalidated(token);
            if (isTokenInvalidated) {
                throw new UnauthorizedException('Token invalidated');
            }
    
            request['user'] = payload;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token expired');
            } else {
                throw new UnauthorizedException('Invalid token');
            }
        }
        return true;
    }    

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}