import {
    Body,
    Controller,
    Get,
    Headers,
    HttpCode,
    HttpStatus,
    Ip,
    Post,
    Request,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Limit, Public } from './decorators/public.decorator';
import { ResponseService } from 'src/shared/services/response.service';
import { Response } from 'express';
import { LoginDto } from './auth.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('api/v1/auth') //route api/v1/auth
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly responseService: ResponseService,
    ) { }

    @Throttle({ default: { limit: 2, ttl: 10000 } }) // custom rate limiter
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Ip() ip: string, @Body() loginDto:LoginDto, @Res() res: Response) {
        try {
            const token = await this.authService.signIn(loginDto.email, loginDto.password, ip);
            return this.responseService.success(res, token, 'Login successful');
        } catch (error) {
            console.log("Error login:", error);
            return this.responseService.failed(res, error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @SkipThrottle() // skip the rate limiter
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Public()
    @Post('refresh')
    async refresh(@Headers('authorization') authorization: string, @Res() res: Response) {
        try {
            const token = authorization.split(' ')[1];
            const newToken = await this.authService.refresh(token);
            return this.responseService.success(res, newToken, 'Refresh token successful');
        } catch (error) {
            return this.responseService.failed(res, error.message, error.response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Public()
    @Post('logout')
    async logout(@Headers('authorization') authorization: string, @Res() res: Response<any>) {
        try {
            const token = authorization.split(' ')[1];
            await this.authService.logout(token);
            return this.responseService.success(res, 'Logout successful');
        } catch (error) {
            return this.responseService.failed(res, 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}