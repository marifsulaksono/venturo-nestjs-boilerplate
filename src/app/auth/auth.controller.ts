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
import { Public } from './decorators/public.decorator';
import { ResponseService } from 'src/shared/services/response.service';
import { Response } from 'express';
import { LoginDto } from './auth.dto';

@Controller('api/v1/auth') //route api/v1/auth
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly responseService: ResponseService,
    ) { }

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

    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Public()
    @Post('forgot-password')
    async forgotPassword(@Body('email') email: string, @Res() res: Response) {
        try {
            await this.authService.forgotPassword(email);
            return this.responseService.success(res, null, 'Email sent successfully');
        } catch (error) {
            console.log("Error forgot password:", error);
            return this.responseService.failed(res, error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Public()
    @Post('forgot-password-sg')
    async forgotPasswordSendgrid(@Body('email') email: string, @Res() res: Response) {
        try {
            await this.authService.forgotPassword(email);
            return this.responseService.success(res, null, 'Email sent successfully');
        } catch (error) {
            console.log("Error forgot password:", error);
            return this.responseService.failed(res, error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
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