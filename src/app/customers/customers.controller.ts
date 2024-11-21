import { Controller, Get, Post, Body, Param, Delete, Res, Query, Put } from '@nestjs/common';
import { Response } from 'express';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './customers.dto';
import { ResponseService } from 'src/shared/services/response.service';
import { Public } from '../auth/decorators/public.decorator';


@Controller('api/v1/customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly responseService: ResponseService, // Menginjeksikan ResponseService
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateCustomerDto, @Res() res: Response) {
    const customer = await this.customersService.create(createUserDto);
    this.responseService.success(res, customer, 'Customer created successfully'); // Menggunakan ResponseService
  }

  @Get()
  async findAll(@Res() res: Response, @Query() query: any) {
    const filter = {
      name: query.name,
      address: query.address
    };
    const page :number =  query.number || 1;
    const itemPerPage :number =  query.itemPerPage || 10;
    
    const customers = await this.customersService.findAll(filter, page, itemPerPage);

    this.responseService.success(res, customers, 'Customers fetched successfully'); // Menggunakan ResponseService
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const customer = await this.customersService.findOne(id);
    if (!customer) {
      this.responseService.failed(res, ['Customer not found'], 404); // Menggunakan ResponseService
    } else {
      this.responseService.success(res, customer, 'Customer found'); // Menggunakan ResponseService
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto, @Res() res: Response) {
    const customer = await this.customersService.update(id, updateCustomerDto);
    if (!customer) {
      this.responseService.failed(res, ['Customer not found'], 404); // Menggunakan ResponseService
    } else {
      this.responseService.success(res, customer, 'Customer updated successfully'); // Menggunakan ResponseService
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const deletedCustomer = await this.customersService.remove(id);
    if (!deletedCustomer) {
      this.responseService.failed(res, ['Customer not found'], 404); // Menggunakan ResponseService
    } else {
      this.responseService.success(res, deletedCustomer, 'Customer deleted successfully'); // Menggunakan ResponseService
    }
  }
}
