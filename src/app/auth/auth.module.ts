import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

import { config } from 'dotenv';
import { UserService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { ResponseService } from 'src/shared/services/response.service';
import { JwtMiddleware } from 'src/middleware/jwt.middleware';
import { TokenAuth } from './auth.entity';
import { UserModule } from '../users/users.module';
config();

@Module({
  imports: [
    TypeOrmModule.forFeature([TokenAuth, User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
    UserModule,
  ],
  providers: [
    AuthService,
    UserService,
    ResponseService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService, UserService],
})
export class AuthModule {}