import { Injectable } from '@nestjs/common';
import { CreateProductCategoryDto, UpdateProductCategoryDto } from './product-categories.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from './product-categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async create(createProductCategoryDto: CreateProductCategoryDto): Promise<ProductCategory> {
    const productCategory = new ProductCategory();
    productCategory.name = createProductCategoryDto.name;
    return this.productCategoryRepository.save(productCategory);
  }

  async findAll(filter: any = {}, page: number, limit: number){

    const queryBuilder = this.productCategoryRepository.createQueryBuilder('productCategory');

    if (filter.name) {
      queryBuilder.where('productCategory.name LIKE :name', { name: `%${filter.name}%` });
    }

    const [productCategories, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

      const links = [];
      const totalPages = Math.ceil(total / limit);
    
      for (let i = 1; i <= totalPages; i++) {
        links.push(`http://localhost:3000/api/v1/productCategories?sort=productCategory_auth.id%20DESC&page=${i}`);
      }
    return {
      list: productCategories,
      meta: {
        links: links,
        total: total
      }
    };
  }

  findOne(id: string): Promise<ProductCategory> {
    return this.productCategoryRepository.findOneBy({ id });
  }

  async update(id: string, updateProductCategoryDto: UpdateProductCategoryDto): Promise<ProductCategory> {
    const productCategory = await this.productCategoryRepository.findOneBy({ id });
    if (!productCategory) {
      return null;
    }
    Object.assign(productCategory, updateProductCategoryDto);
    return this.productCategoryRepository.save(productCategory);
  }

  remove(id: string): Promise<{ affected?: number }> {
    return this.productCategoryRepository.softDelete(id)
  }
}
