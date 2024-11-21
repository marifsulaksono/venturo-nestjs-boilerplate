import { Controller, Get, Post, Body, Param, Delete, Res, Query, Put, Header } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto, UpdateSaleDto } from './sales.dto';
import { Response } from 'express';
import { Public } from '../auth/decorators/public.decorator';
import { ResponseService } from 'src/shared/services/response.service';
import { generateSalesReportExcel, getPeriod, reformatSalesReport } from './sales.report';

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
      start: query.start_date,
      end: query.end_date,
      category: query.category_id
    };
    const page :number =  query.number || 1;
    const itemPerPage :number =  query.itemPerPage || 10;
    
    const sales = await this.saleService.findAllWithPagination(filter, page, itemPerPage);

    this.responseService.success(res, sales, 'Sales fetched successfully'); // Menggunakan ResponseService
  }

  @Get('/report')
  async findAllSaleReport(@Res() res: Response, @Query() query: any) {
    const filter = {
      name: query.name,
      start: query.start_date,
      end: query.end_date,
      category: query.category_id
    };
    const page :number =  query.number || 1;
    const itemPerPage :number =  query.itemPerPage || 10;
    
    const sales = await this.saleService.findAll(filter, page, itemPerPage);

    const [periods, dates, error] = getPeriod(filter.start, filter.end);
    const formatedReport = reformatSalesReport(sales, dates);
    this.responseService.success(res, formatedReport, 'Report sales fetched successfully'); // Menggunakan ResponseService
  }

  @Get('/download/report')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="sales-report.xlsx"')
  async ExportAllSaleReport(@Res() res: Response, @Query() query: any) {
    const filter = {
      name: query.name,
      start: query.start_date,
      end: query.end_date,
      category: query.category_id
    };
    const page :number =  query.number || 1;
    const itemPerPage :number =  query.itemPerPage || 10;
    
    const sales = await this.saleService.findAll(filter, page, itemPerPage);

    const [periods, dates, error] = getPeriod(filter.start, filter.end);
    const formatedReport = reformatSalesReport(sales, dates);
    const workbook = await generateSalesReportExcel(formatedReport, dates);

  // Send the workbook as an Excel file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="sales-report.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
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
