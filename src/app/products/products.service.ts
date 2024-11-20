import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './products.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductDetail } from './products.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) { }

  async create(request: CreateProductDto): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product: Product = new Product();
      product.name = request.name;
      product.price = request.price;
      product.description = request.description;
      product.product_category_id = request.product_category_id;

      const savedProduct = await queryRunner.manager.save(Product, product);

      for (const detail of request.details) {
        const productDetail: ProductDetail = new ProductDetail();
        productDetail.product_id = savedProduct.id;
        productDetail.type = detail.type;
        productDetail.description = detail.description;
        productDetail.price = detail.price;
  
        await queryRunner.manager.save(ProductDetail, productDetail);
      }

      await queryRunner.commitTransaction();
      return savedProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }


  async findAll(filter: any = {}, page: number, limit: number) {
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    queryBuilder.leftJoinAndSelect('product.product_category', 'category');
    if (filter.name) {
      queryBuilder.where('product.name LIKE :name', { name: `%${filter.name}%` });
    }

    const [products, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

      const links = [];
      const totalPages = Math.ceil(total / limit);
    
      for (let i = 1; i <= totalPages; i++) {
        links.push(`http://localhost:3000/api/v1/products?sort=product_auth.id%20DESC&page=${i}`);
      }
    return {
      list: products,
      meta: {
        links: links,
        total: total
      }
    };
  }

  async findOne(id: string): Promise<Product> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    queryBuilder.leftJoinAndSelect('product.product_category', 'category')
    .where('product.id = :id', { id: id });
    return await queryBuilder.getOne();
  }

  async update(id: string, request: UpdateProductDto): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const productUpdate = {
        name: request.name,
        price: request.price,
        description: request.description,
        product_category_id: request.product_category_id,
      };

      await queryRunner.manager.update(Product, { id: id }, productUpdate);
      await queryRunner.manager.delete(ProductDetail, { product_id: id });

      for (const detail of request.details) {
        const productDetail: ProductDetail = new ProductDetail();
        productDetail.product_id = id;
        productDetail.type = detail.type;
        productDetail.description = detail.description;
        productDetail.price = detail.price;

        await queryRunner.manager.save(ProductDetail, productDetail);
      }

      await queryRunner.commitTransaction();
      return this.productRepository.findOneBy({ id });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

  }

  remove(id: string): Promise<{ affected?: number }> {
    return this.productRepository.softDelete(id)
  }
}
