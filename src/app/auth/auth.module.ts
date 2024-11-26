import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { UserService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { ResponseService } from 'src/shared/services/response.service';
import { TokenAuth } from './auth.entity';
import { UserModule } from '../users/users.module';
import { ThrottlerGuard } from '@nestjs/throttler';
import { config } from 'dotenv';

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
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
  controllers: [AuthController],
  exports: [AuthService, UserService],
})
export class AuthModule {}