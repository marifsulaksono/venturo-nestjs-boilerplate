import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/users.service';
import { access } from 'fs';

@Injectable()
export class AuthService {
    // Array untuk menyimpan token yang sudah logout
    private readonly invalidatedTokens: string[] = [];

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async signIn(email: string, password: string): Promise<{ access_token: string }> {
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Email atau password salah.');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Email atau password salah.');
        }

        console.log("access", user.role.access);

        const payload = { sub: user.id, email: user.email, access: user.role.access };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    // Fungsi untuk menambahkan token ke dalam daftar token yang sudah logout
    async logout(token: string): Promise<void> {
        this.invalidatedTokens.push(token);
    }

    // Fungsi untuk memeriksa apakah token sudah logout atau belum
    async isTokenInvalidated(token: string): Promise<boolean> {
        return this.invalidatedTokens.includes(token);
    }
}
