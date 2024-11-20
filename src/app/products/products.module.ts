import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductDetail } from './products.entity';
import { ProductCategory } from '../product-categories/product-categories.entity';
import { ResponseService } from 'src/shared/services/response.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductDetail, ProductCategory])],
  controllers: [ProductsController],
  providers: [ProductsService, ResponseService],
})
export class ProductsModule {}
