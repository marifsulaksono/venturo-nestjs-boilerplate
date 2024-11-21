import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { ProductCategory } from "../product-categories/product-categories.entity";
import { SaleDetail } from "../sales/sales.entity";

@Entity({ name: 'products' })
export class Product {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({ type: 'uuid' })
   product_category_id: string;

   @ManyToOne(() => ProductCategory, product_category => product_category.product)
   @JoinColumn({ name: 'product_category_id' })
   product_category: ProductCategory;

   @Column({ type: 'varchar' })
   name: string;

   @Column({ type: 'double' })
   price: number;

   @Column({ type: 'varchar', nullable: true })
   description: string;

   @Column({ type: 'varchar', nullable: true })
   photo: string;

   @Column({ type: 'boolean', default: true })
   is_available: boolean;

   @CreateDateColumn({ name: 'created_at' })
   created_at: Date;
 
   @UpdateDateColumn({ name: 'updated_at' })
   updated_at: Date;
 
   @DeleteDateColumn({ name: 'deleted_at' })
   deleted_at: Date;

   @OneToMany(() => ProductDetail, product_detail => product_detail.product)
   details: ProductDetail[];

   @OneToMany(() => SaleDetail, sale_detail => sale_detail.product)
   sale_detail: SaleDetail[];
   
   @BeforeInsert()
  private generateUUID() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}

@Entity({ name: 'product_details' })
export class ProductDetail {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({ type: 'uuid', nullable: true })
   product_id: string;

   @ManyToOne(() => Product, product => product.details)
   @JoinColumn({ name: 'product_id' })
   product: Product;

   @Column({ type: 'enum', enum: ['Level', 'Topping'] })
   type: string;

   @Column({ type: 'varchar', nullable: true })
   description: string;

   @Column({ type: 'double' })
   price: number;

   @CreateDateColumn({ name: 'created_at' })
   created_at: Date;
 
   @UpdateDateColumn({ name: 'updated_at' })
   updated_at: Date;
 
   @DeleteDateColumn({ name: 'deleted_at' })
   deleted_at: Date;

   @OneToMany(() => SaleDetail, sale_detail => sale_detail.product_detail)
   sale_detail: SaleDetail[];
   
   @BeforeInsert()
  private generateUUID() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}