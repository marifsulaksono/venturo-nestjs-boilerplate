import { Injectable } from '@nestjs/common';
import { CreateSaleDto, UpdateSaleDto } from './sales.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale, SaleDetail } from './sales.entity';
import { DataSource, Repository } from 'typeorm';
import { Product, ProductDetail } from '../products/products.entity';
import { Customer } from '../customers/customers.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    private readonly dataSource: DataSource,
  ) { }

  async create(request: CreateSaleDto): Promise<Sale> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); // db transaction for consistency data

    try {
      let total: number = 0;
      const customer = await queryRunner.manager.findOneBy(Customer, { id: request.customer_id });
      if (!customer) {
        throw new Error('Customer not found');
      }

      const sale: Sale = new Sale();
      sale.customer_id = request.customer_id;
      const savedSale = await queryRunner.manager.save(Sale, sale);

      for (const detail of request.details) {
        const product = await queryRunner.manager.findOneBy(Product, { id: detail.product_id });
        if (!product) { throw new Error('Product not found'); }


        const product_detail = await queryRunner.manager.findOneBy(ProductDetail, { id: detail.product_detail_id });
        if (!product_detail) { throw new Error('Product Detail not found'); }

        const saleDetail: SaleDetail = new SaleDetail();
        saleDetail.sales_id = savedSale.id;
        saleDetail.product_id = detail.product_id;
        saleDetail.product_detail_id = detail.product_detail_id;
        saleDetail.total_item = detail.total_item;
        saleDetail.price = detail.price;
  
        await queryRunner.manager.save(SaleDetail, saleDetail);

        total = total + (detail.price * detail.total_item);
      }

      await queryRunner.manager.update(Sale, { id: savedSale.id }, { total: total });

      await queryRunner.commitTransaction();
      return this.saleRepository.findOneBy({ id: savedSale.id });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(filter: any = {}, page: number, limit: number) {
    const queryBuilder = this.saleRepository.createQueryBuilder('sale');
    queryBuilder.leftJoinAndSelect('sale.customer', 'c');
    queryBuilder.leftJoinAndSelect('sale.details', 'details');
    queryBuilder.leftJoinAndSelect('details.product', 'product');
    queryBuilder.leftJoinAndSelect('details.product_detail', 'product_detail');
    if (filter.name) {
      queryBuilder.where('c.name LIKE :name', { name: `%${filter.name}%` });
    }

    console.log(queryBuilder.getQuery())

    const [sales, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

      const links = [];
      const totalPages = Math.ceil(total / limit);
    
      for (let i = 1; i <= totalPages; i++) {
        links.push(`http://localhost:3000/api/v1/sales?sort=product_auth.id%20DESC&page=${i}`);
      }
    return {
      list: sales,
      meta: {
        links: links,
        total: total
      }
    };
  }

  async findOne(id: string): Promise<Sale> {
    const queryBuilder = this.saleRepository.createQueryBuilder('sale');
    queryBuilder.leftJoinAndSelect('sale.customer', 'c');
    queryBuilder.leftJoinAndSelect('sale.details', 'details');
    queryBuilder.leftJoinAndSelect('details.product', 'product');
    queryBuilder.leftJoinAndSelect('details.product_detail', 'product_detail')
    .where('sale.id = :id', { id: id });
    return await queryBuilder.getOne();
  }

  async update(id: string, request: UpdateSaleDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      let total: number = 0;
  
      // Fetch existing Sale record
      const existingSale = await queryRunner.manager.findOneBy(Sale, { id });
      if (!existingSale) {
        throw new Error('Sale not found');
      }
  
      // Validate the customer
      const customer = await queryRunner.manager.findOneBy(Customer, { id: request.customer_id });
      if (!customer) {
        throw new Error('Customer not found');
      }
  
      // Update Sale entity
      existingSale.customer_id = request.customer_id;
      const updatedSale = await queryRunner.manager.save(Sale, existingSale);
  
      for (const detail of request.details) {
        // Handle added SaleDetails
        if (detail.is_added) {
          const product = await queryRunner.manager.findOneBy(Product, { id: detail.product_id });
          if (!product) {
            throw new Error('Product not found');
          }
  
          const product_detail = await queryRunner.manager.findOneBy(ProductDetail, { id: detail.product_detail_id });
          if (!product_detail) {
            throw new Error('Product Detail not found');
          }
  
          const newSaleDetail: SaleDetail = new SaleDetail();
          newSaleDetail.sales_id = updatedSale.id;
          newSaleDetail.product_id = detail.product_id;
          newSaleDetail.product_detail_id = detail.product_detail_id;
          newSaleDetail.total_item = detail.total_item;
          newSaleDetail.price = detail.price;
  
          await queryRunner.manager.save(SaleDetail, newSaleDetail);
  
          total += detail.price * detail.total_item;
        }
  
        // Handle updated SaleDetails
        if (detail.is_updated) {
          const existingSaleDetail = await queryRunner.manager.findOneBy(SaleDetail, { id: detail.id });
          if (!existingSaleDetail) {
            throw new Error('SaleDetail not found for update');
          }
  
          existingSaleDetail.product_id = detail.product_id;
          existingSaleDetail.product_detail_id = detail.product_detail_id;
          existingSaleDetail.total_item = detail.total_item;
          existingSaleDetail.price = detail.price;
  
          await queryRunner.manager.save(SaleDetail, existingSaleDetail);
  
          total += detail.price * detail.total_item;
        }
  
        // Handle deleted SaleDetails
        if (detail.is_deleted) {
          await queryRunner.manager.delete(SaleDetail, { id: detail.id });
        }
      }
  
      // Update the Sale total
      await queryRunner.manager.update(Sale, { id: updatedSale.id }, { total });
  
      await queryRunner.commitTransaction();
      return this.saleRepository.findOneBy({ id: updatedSale.id });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }  

  remove(id: string): Promise<{ affected?: number }> {
    return this.saleRepository.softDelete(id)
  }
}
