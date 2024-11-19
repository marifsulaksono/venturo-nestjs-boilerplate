import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './role.entity';
import { ResponseService } from 'src/shared/services/response.service';

@Module({
  imports:[TypeOrmModule.forFeature([Roles])],
  controllers: [RolesController],
  providers: [RolesService,ResponseService],
})
export class RolesModule {}
