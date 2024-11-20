import { Module } from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { ProductCategoriesController } from './product-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from 'src/shared/services/response.service';
import { ProductCategory } from './product-categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory])],
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService, ResponseService],
})
export class ProductCategoriesModule {}
