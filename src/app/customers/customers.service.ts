import { Injectable } from '@nestjs/common';
import { CreateCustomerDto, UpdateCustomerDto } from './customers.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { DataSource, Repository } from 'typeorm';
import { Customer } from './customers.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly dataSource: DataSource,
  ) { }
  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const queryRunner = this.dataSource.createQueryRunner();

    // Start a new transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create and save the user
      const user: User = new User();
      user.email = createCustomerDto.email;
      user.username = createCustomerDto.username;
      user.password = await bcrypt.hash(createCustomerDto.password, 10);
      user.role_id = createCustomerDto.role_id;

      const savedUser = await queryRunner.manager.save(User, user);

      // Create and save the customer
      const customer: Customer = new Customer();
      customer.user_id = savedUser.id;
      customer.name = createCustomerDto.name;
      customer.phonenumber = createCustomerDto.phonenumber;
      customer.address = createCustomerDto.address;
      customer.photo = createCustomerDto.photo;

      const savedCustomer = await queryRunner.manager.save(Customer, customer);

      // Commit the transaction
      await queryRunner.commitTransaction();

      return savedCustomer;
    } catch (error) {
      // Roll back the transaction on error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  async findAll(filter: any = {}, page: number, limit: number) {
    const queryBuilder = this.customerRepository.createQueryBuilder('customer');
    queryBuilder.leftJoinAndSelect('customer.user', 'user');
    if (filter.name) {
      queryBuilder.where('customer.name LIKE :name', { name: `%${filter.name}%` });
    }

    if (filter.address) {
      queryBuilder.andWhere('customer.address LIKE :address', { address: `%${filter.address}%` });
    }

    const [customers, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

      const links = [];
      const totalPages = Math.ceil(total / limit);
    
      for (let i = 1; i <= totalPages; i++) {
        links.push(`http://localhost:3000/api/v1/customers?sort=customer.id%20DESC&page=${i}`);
      }
    return {
      list: customers,
      meta: {
        links: links,
        total: total
      }
    };
  }

  findOne(id: string): Promise<Customer> {
    return this.customerRepository.findOneBy({ id });
  }

  async update(id: string, request: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) {
      return null;
    }
    Object.assign(customer, request);
    return this.customerRepository.save(customer);
  }

  remove(id: string): Promise<{ affected?: number }> {
    return this.customerRepository.softDelete(id)
  }
}
