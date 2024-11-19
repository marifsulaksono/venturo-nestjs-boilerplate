import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { ResponseService } from 'src/shared/services/response.service';
import { JwtMiddleware } from 'src/middleware/jwt.middleware';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService,AuthService,ResponseService],
})
export class UserModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(JwtMiddleware).forRoutes('api/v1/user*'); // Apply to all routes
  // }
}