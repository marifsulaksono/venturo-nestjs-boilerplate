import { Controller, Get, Post, Body, Param, Delete, Put, Res, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './products.dto';
import { Public } from '../auth/decorators/public.decorator';
import { ResponseService } from 'src/shared/services/response.service';
import { Response } from 'express';

@Public()
@Controller('api/v1/products')
export class ProductsController {
  constructor(
    private readonly productService: ProductsService,
    private readonly responseService: ResponseService, // Menginjeksikan ResponseService
  ) { }

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Res() res: Response) {
    const product = await this.productService.create(createProductDto);
    this.responseService.success(res, product, 'Product created successfully'); // Menggunakan ResponseService
  }

  @Get()
  @Public()
  async findAll(@Res() res: Response, @Query() query: any) {
    const filter = {
      name: query.name,
    };
    const page :number =  query.number || 1;
    const itemPerPage :number =  query.itemPerPage || 10;
    
    const products = await this.productService.findAll(filter, page, itemPerPage);

    this.responseService.success(res, products, 'Products fetched successfully'); // Menggunakan ResponseService
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const product = await this.productService.findOne(id);
    if (!product) {
      this.responseService.failed(res, ['Product not found'], 404); // Menggunakan ResponseService
    } else {
      this.responseService.success(res, product, 'Product found'); // Menggunakan ResponseService
    }
  }

  @Public()
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Res() res: Response) {
    const product = await this.productService.update(id, updateProductDto);
    this.responseService.success(res, product, 'Product updated successfully'); // Menggunakan ResponseService
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const deletedProduct = await this.productService.remove(id);
    if (!deletedProduct) {
      this.responseService.failed(res, ['Product not found'], 404); // Menggunakan ResponseService
    } else {
      this.responseService.success(res, deletedProduct, 'Product deleted successfully'); // Menggunakan ResponseService
    }
  }
}
