import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, Put } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto, UpdateSaleDto } from './sales.dto';
import { Response } from 'express';
import { Public } from '../auth/decorators/public.decorator';
import { ResponseService } from 'src/shared/services/response.service';

@Public()
@Controller('api/v1/sales')
export class SalesController {
  constructor(
    private readonly saleService: SalesService,
    private readonly responseService: ResponseService, // Menginjeksikan ResponseService
  ) { }

  @Post()
  async create(@Body() createSaleDto: CreateSaleDto, @Res() res: Response) {
    try {
      const sale = await this.saleService.create(createSaleDto);
      this.responseService.success(res, sale, 'Sale created successfully'); // Menggunakan ResponseService
    } catch (error) {
      console.log("Error create sales:", error);
      this.responseService.failed(res, [error.message], 500);
    }
  }

  @Get()
  async findAll(@Res() res: Response, @Query() query: any) {
    const filter = {
      name: query.name,
      start: query.start,
      end: query.end,
    };
    const page :number =  query.number || 1;
    const itemPerPage :number =  query.itemPerPage || 10;
    
    const sales = await this.saleService.findAll(filter, page, itemPerPage);

    this.responseService.success(res, sales, 'Sales fetched successfully'); // Menggunakan ResponseService
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const sale = await this.saleService.findOne(id);
    if (!sale) {
      this.responseService.failed(res, ['Sale not found'], 404); // Menggunakan ResponseService
    } else {
      this.responseService.success(res, sale, 'Sale found'); // Menggunakan ResponseService
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto, @Res() res: Response) {
    try {
      const sale = await this.saleService.update(id, updateSaleDto);
      this.responseService.success(res, sale, 'Sale updated successfully'); // Menggunakan ResponseService
    } catch (error) {
      console.log("Error update sales:", error);
      this.responseService.failed(res, [error.message], 500);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const deletedSale = await this.saleService.remove(id);
    if (!deletedSale) {
      this.responseService.failed(res, ['Sale not found'], 404); // Menggunakan ResponseService
    } else {
      this.responseService.success(res, deletedSale, 'Sale deleted successfully'); // Menggunakan ResponseService
    }
  }
}
