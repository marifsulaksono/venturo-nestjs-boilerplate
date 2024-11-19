import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto, UpdateRoleDto } from './role.dto';
import { Roles } from './role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Roles> {
    const role = new Roles();
    role.name = createRoleDto.name;
    role.access = JSON.stringify(createRoleDto.access);
    return this.roleRepository.save(role);
  }

  async findAll(filter: any = {}, page: number, limit: number){

    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    if (filter.name) {
      queryBuilder.where('role.name LIKE :name', { name: `%${filter.name}%` });
    }

    const [roles, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

      const links = [];
      const totalPages = Math.ceil(total / limit);
    
      for (let i = 1; i <= totalPages; i++) {
        links.push(`http://localhost:3000/api/v1/roles?sort=role_auth.id%20DESC&page=${i}`);
      }
    return {
      list: roles,
      meta: {
        links: links,
        total: total
      }
    };
  }

  findOne(id: string): Promise<Roles> {
    return this.roleRepository.findOneBy({ id });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Roles> {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) {
      return null;
    }
    updateRoleDto.access = JSON.stringify(updateRoleDto.access);
    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  remove(id: string): Promise<{ affected?: number }> {
    return this.roleRepository.softDelete(id)
  }
}
