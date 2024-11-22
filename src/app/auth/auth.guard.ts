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
    ) {}

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
                secret: process.env.JWT_ACCESS_SECRET,
            });

            request['user'] = payload;

            // Mengecek apakah role sesuai dengan yang dibutuhkan
            const requiredRoles = this.reflector.get<string>('requiredRoles', context.getHandler());
            if (requiredRoles && !this.hasRole(payload, requiredRoles)) {
                throw new UnauthorizedException('Access denied');
            }
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token expired');
            } else {
                throw new UnauthorizedException(error.message);
            }
        }

        return true;
    }

    // Fungsi untuk memeriksa token pada header request
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    // Fungsi untuk memeriksa apakah pengguna memiliki role yang sesuai
    private hasRole(user: any, requiredRoles: string): boolean {
        try {
            if (requiredRoles === "") {
                return true;
            }
            console.log("user:", user)
            const accessMap = JSON.parse(user.access);
            const requiredPermissions = requiredRoles.split(',');

            for (const permission of requiredPermissions) {
                const [feature, activity] = permission.split('.');

                if (!accessMap[feature] || !accessMap[feature][activity]) {
                    return false;
                }
            }

            return true;
        } catch (error) {
            return false;
        }
    }
}
