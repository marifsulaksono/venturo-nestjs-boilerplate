import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customers.entity';
import { User } from '../users/users.entity';
import { ResponseService } from 'src/shared/services/response.service';
import { JwtMiddleware } from 'src/middleware/jwt.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, User])],
  controllers: [CustomersController],
  providers: [CustomersService, ResponseService],
})
export class CustomersModule {}
