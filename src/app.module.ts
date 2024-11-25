import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { UserModule } from './app/users/users.module';
import { AuthModule } from './app/auth/auth.module';
import { RolesModule } from './app/roles/roles.module';
import { CustomersModule } from './app/customers/customers.module';
import { ProductsModule } from './app/products/products.module';
import { ProductCategoriesModule } from './app/product-categories/product-categories.module';
import { SalesModule } from './app/sales/sales.module';
import { LogMiddleware } from './middleware/log.middleware';
import { Logger } from './shared/services/logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LogModule } from './app/log/log.module';
import { LogService } from './app/log/log.service';

config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      logging: true,
      synchronize: false,
      migrationsTableName: 'typeorm_migrations',
      migrationsRun: false,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    LogModule,
    UserModule,
    AuthModule,
    RolesModule,
    CustomersModule,
    ProductsModule,
    ProductCategoriesModule,
    SalesModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger, LogService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('*'); // Apply middleware to all routes
  }
}