import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { UserModule } from './app/users/users.module';
import { AuthModule } from './app/auth/auth.module';
import { AuthService } from './app/auth/auth.service';
import { ResponseService } from './shared/services/response.service';
import { RolesModule } from './app/roles/roles.module';
import { CustomersModule } from './app/customers/customers.module';
import { User } from './app/users/users.entity';
import { Roles } from './app/roles/role.entity';
import { Customer } from './app/customers/customers.entity';
import { ProductsModule } from './app/products/products.module';
import { ProductCategoriesModule } from './app/product-categories/product-categories.module';

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
    UserModule,
    AuthModule,
    RolesModule,
    CustomersModule,
    ProductsModule,
    ProductCategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// entities: [__dirname + '/**/*.entity{.ts,.js}'],