import { Controller, Get, Post, Body, Param, Delete, Res, Query, Put } from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto, UpdateProductCategoryDto } from './product-categories.dto';
import { ResponseService } from 'src/shared/services/response.service';
import { Public } from '../auth/decorators/public.decorator';
import { Response } from 'express';

@Public() // Menambahkan decorator Public
@Controller('api/v1/productCategories')
export class ProductCategoriesController {
  constructor(
    private readonly productCategoryService: ProductCategoriesService,
    private readonly responseService: ResponseService // Menginjeksikan ResponseService jika diperlukan
  ) {}

  @Post()
  async create(@Body() createProductCategoryDto: CreateProductCategoryDto, @Res() res: Response) {
    const productCategory = await this.productCategoryService.create(createProductCategoryDto);
    this.responseService.success(res, productCategory, 'Product Category created successfully'); // Menggunakan ResponseService jika diperlukan
  }

  @Get()
  async findAll(@Res() res: Response, @Query() query: any) {
    const filter = {
      name: query.name,
    };
    const page :number =  query.number || 1;
    const itemPerPage :number =  query.itemPerPage || 10;
    const productCategories = await this.productCategoryService.findAll(filter, page, itemPerPage);
    this.responseService.success(res, productCategories, 'Product Categories fetched successfully'); // Menggunakan ResponseService
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const productCategory = await this.productCategoryService.findOne(id);
    if (!productCategory) {
      this.responseService.failed(res, ['Product Category not found'], 404); // Menggunakan ResponseService jika diperlukan
    } else {
      this.responseService.success(res, productCategory, 'Product Category found'); // Menggunakan ResponseService jika diperlukan
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductCategoryDto: UpdateProductCategoryDto, @Res() res: Response) {
    const productCategory = await this.productCategoryService.update(id, updateProductCategoryDto);
    this.responseService.success(res, productCategory, 'Product Category updated successfully'); // Menggunakan ResponseService jika diperlukan
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const deletedProductCategory = await this.productCategoryService.remove(id);
    if (!deletedProductCategory) {
      this.responseService.failed(res, ['Product Category not found'], 404); // Menggunakan ResponseService jika diperlukan
    } else {
      this.responseService.success(res, deletedProductCategory, 'Product Category deleted successfully'); // Menggunakan ResponseService jika diperlukan
    }
  }
}
