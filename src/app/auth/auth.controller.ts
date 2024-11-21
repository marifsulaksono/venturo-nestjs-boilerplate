import {
    Body,
    Controller,
    Get,
    Headers,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { ResponseService } from 'src/shared/services/response.service';
import { Response } from 'express';

@Controller('api/v1/auth') //route api/v1/auth
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly responseService: ResponseService,
    ) { }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: Record<string, any>, @Res() res: Response) {
        try {
            const token = await this.authService.signIn(signInDto.email, signInDto.password);
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