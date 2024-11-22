import { Controller, Get, Post, Body, Param, Delete, Res, Query, Put, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './users.service';
import { UpdateUserDto, CreateUserDto } from './users.dto';
import { ResponseService } from 'src/shared/services/response.service';
import { Public, Roles } from '../auth/decorators/public.decorator';
import { JwtMiddleware } from 'src/middleware/jwt.middleware';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/v1/users') // prefix: api/v1/user
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly responseService: ResponseService, // Menginjeksikan ResponseService
  ) { }

  @Post()
  @Roles('user.create')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.userService.create(createUserDto);
    this.responseService.success(res, user, 'User created successfully'); // Menggunakan ResponseService
  }

  @Get()
  @Public()
  async findAll(@Res() res: Response, @Query() query: any) {
    const filter = {
      username: query.username,
      email: query.email
    };
    const page :number =  query.number || 1;
    const itemPerPage :number =  query.itemPerPage || 10;
    
    const users = await this.userService.findAll(filter, page, itemPerPage);

    this.responseService.success(res, users, 'Users fetched successfully'); // Menggunakan ResponseService
  }

  @Get(':id')
  @Roles('user.view')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    console.log("incoming request")
    const user = await this.userService.findOne(id);
    if (!user) {
      this.responseService.failed(res, ['User not found'], 404); // Menggunakan ResponseService
    } else {
      this.responseService.success(res, user, 'User found'); // Menggunakan ResponseService
    }
  }

  @Public()
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    const user = await this.userService.update(id, updateUserDto);
    this.responseService.success(res, user, 'User updated successfully'); // Menggunakan ResponseService
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const deletedUser = await this.userService.remove(id);
    if (!deletedUser) {
      this.responseService.failed(res, ['User not found'], 404); // Menggunakan ResponseService
    } else {
      this.responseService.success(res, deletedUser, 'User deleted successfully'); // Menggunakan ResponseService
    }
  }
}
