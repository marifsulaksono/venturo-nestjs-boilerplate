import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(request: CreateUserDto): Promise<User> {
    const user: User = new User();
    user.email = request.email;
    user.username = request.username;
    user.password = await bcrypt.hash(request.password, 10);
    user.role_id = request.role_id;
    return this.userRepository.save(user);
  }


  async findAll(filter: any = {}, page: number, limit: number) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.leftJoinAndSelect('user.role', 'roles');
    if (filter.username) {
      queryBuilder.where('user.username LIKE :username', { username: `%${filter.username}%` });
    }

    if (filter.email) {
      queryBuilder.andWhere('user.email LIKE :email', { email: `%${filter.email}%` });
    }

    const [users, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

      const links = [];
      const totalPages = Math.ceil(total / limit);
    
      for (let i = 1; i <= totalPages; i++) {
        links.push(`http://localhost:3000/api/v1/users?sort=user_auth.id%20DESC&page=${i}`);
      }
    return {
      list: users,
      meta: {
        links: links,
        total: total
      }
    };
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  findOneByEmail(email: string): Promise<User> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.leftJoinAndSelect('user.role', 'roles')
    .where('user.email = :email', { email: email });
    return queryBuilder.getOne();
  }

  async update(id: string, request: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return null;
    }
    Object.assign(user, request);
    return this.userRepository.save(user);
  }

  remove(id: string): Promise<{ affected?: number }> {
    return this.userRepository.softDelete(id)
  }
}
