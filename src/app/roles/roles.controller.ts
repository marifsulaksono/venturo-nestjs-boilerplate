import { Controller, Get, Post, Body, Param, Put, Delete, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { CreateRoleDto, UpdateRoleDto } from './role.dto';
import { RolesService } from './roles.service';
import { ResponseService } from 'src/shared/services/response.service'; // Pastikan untuk mengimpor ResponseService jika diperlukan
import { Public } from '../auth/decorators/public.decorator'; // Mengimpor decorator Public

@Controller('api/v1/roles')
export class RolesController {
  constructor(
    private readonly roleService: RolesService,
    private readonly responseService: ResponseService // Menginjeksikan ResponseService jika diperlukan
  ) {}

  @Public() // Menambahkan decorator Public
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto, @Res() res: Response) {
    const role = await this.roleService.create(createRoleDto);
    this.responseService.success(res, role, 'Role created successfully'); // Menggunakan ResponseService jika diperlukan
  }

  @Public() // Menambahkan decorator Public
  @Get()
  async findAll(@Res() res: Response, @Query() query: any) {
    const filter = {
      name: query.name,
    };
    const page :number =  query.number || 1;
    const itemPerPage :number =  query.itemPerPage || 10;
    const roles = await this.roleService.findAll(filter, page, itemPerPage);
    this.responseService.success(res, roles, 'Roles fetched successfully'); // Menggunakan ResponseService
  }

  @Public() // Menambahkan decorator Public
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const role = await this.roleService.findOne(id);
    if (!role) {
      this.responseService.failed(res, ['Role not found'], 404); // Menggunakan ResponseService jika diperlukan
    } else {
      this.responseService.success(res, role, 'Role found'); // Menggunakan ResponseService jika diperlukan
    }
  }

  @Public() // Menambahkan decorator Public
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @Res() res: Response) {
    const role = await this.roleService.update(id, updateRoleDto);
    this.responseService.success(res, role, 'Role updated successfully'); // Menggunakan ResponseService jika diperlukan
  }

  @Public() // Menambahkan decorator Public
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const deletedRole = await this.roleService.remove(id);
    if (!deletedRole) {
      this.responseService.failed(res, ['Role not found'], 404); // Menggunakan ResponseService jika diperlukan
    } else {
      this.responseService.success(res, deletedRole, 'Role deleted successfully'); // Menggunakan ResponseService jika diperlukan
    }
  }
}
