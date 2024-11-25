import { Controller, Get, Post, Body, Param, Delete, Res, Query, Put, Patch } from '@nestjs/common';
import { Response } from 'express';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './customers.dto';
import { ResponseService } from 'src/shared/services/response.service';
import { Public } from '../auth/decorators/public.decorator';
import { writeFile } from 'src/shared/utils/assets';
import { getTimestamp } from 'src/shared/utils/common';


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

  @Patch(':id/photo')
  async uploadPhoto(@Param('id') id: string,@Body('photo') photo: string, @Res() res: Response) {
    try {
      const customer = await this.customersService.findOne(id);

      if (!customer) {
        return this.responseService.failed(res, ['Customer not found'], 404);
      }

      const timestamp = await getTimestamp();
      const filename = `${timestamp}_${customer.name}.png`;

      await writeFile(photo, 'photo_profile', filename);

      return this.responseService.success(res, null, 'Photo uploaded successfully');
    } catch (error) {
      console.error('Error uploading photo:', error);
      return this.responseService.failed(res, [error.message], 500);
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
