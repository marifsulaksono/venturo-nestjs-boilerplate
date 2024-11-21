import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale, SaleDetail } from './sales.entity';
import { ResponseService } from 'src/shared/services/response.service';
import { Customer } from '../customers/customers.entity';
import { Product, ProductDetail } from '../products/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, SaleDetail, Customer, Product, ProductDetail])],
  controllers: [SalesController],
  providers: [SalesService, ResponseService],
})
export class SalesModule {}
