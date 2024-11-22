import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenAuth } from './auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(TokenAuth)
        private readonly authRepository: Repository<TokenAuth>,
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async signIn(email: string, password: string, ip: string): Promise<any> {
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Email atau password salah.');
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Email atau password salah.');
        }
    
        const payload = { sub: user.id, email: user.email, access: user.role.access };
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: '15m',
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
        });
    
        // Upsert refresh token
        const existingToken = await this.authRepository.findOneBy({ user_id: user.id, ip });
    
        if (existingToken) {
            // Update existing token
            await this.authRepository.update(
                { user_id: user.id, ip },
                { token: refreshToken }
            );
        } else {
            // Insert new token
            const newToken = this.authRepository.create({
                user_id: user.id,
                ip,
                token: refreshToken,
            });
            await this.authRepository.save(newToken);
        }
    
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            metadata: {
                username: user.username,
                email: user.email,
                access: user.role.access,
            },
        };
    }

    async getTokenByToken(token: string): Promise<TokenAuth> {
        return await this.authRepository.findOneBy({ token: token });
    }

    async getTokenByUserIdAndIP(userId: string, ip: string): Promise<TokenAuth> {
        return await this.authRepository.findOneBy({ user_id: userId, ip: ip });
    }

    async refresh(token: string ): Promise<any> {
        try {
            const existToken = await this.getTokenByToken(token);
            if (!existToken) {
                throw new UnauthorizedException('Invalid refresh token');
            }
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_REFRESH_SECRET,
            });

            const newPayload = {
                sub: payload.sub,
                email: payload.email,
                access: payload.access,
            };
    
            const access_token = this.jwtService.sign(newPayload, {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: '15m',
            });

            return {
                access_token: access_token,
                refresh_token: token,
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    // Fungsi untuk menambahkan token ke dalam daftar token yang sudah logout
    async logout(token: string): Promise<void> {
        await this.authRepository.delete({ token: token });
    }
}
