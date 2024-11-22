import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { Customer } from "../customers/customers.entity";
import { Product, ProductDetail } from "../products/products.entity";

@Entity({ name: 'sales' })
export class Sale {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({ type: 'uuid' })
   customer_id: string;

   @ManyToOne(() => Customer, customer => customer.sales)
   @JoinColumn({ name: 'customer_id' })
   customer: Customer;

   @Column({ type: 'double' })
   total: number;

   @CreateDateColumn({ name: 'created_at' })
   created_at: Date;
 
   @UpdateDateColumn({ name: 'updated_at' })
   updated_at: Date;
 
   @DeleteDateColumn({ name: 'deleted_at' })
   deleted_at: Date;

   @OneToMany(() => SaleDetail, sale_detail => sale_detail.sale)
   details: SaleDetail[];
   
   @BeforeInsert()
   private generateUUID() {
      if (!this.id) {
         this.id = uuidv4();
      }
   }
}

@Entity({ name: 'sale_details' })
export class SaleDetail {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({ type: 'uuid' })
   sales_id: string;

   @ManyToOne(() => Sale, sale => sale.details)
   @JoinColumn({ name: 'sales_id' })
   sale: Sale;

   @Column({ type: 'uuid' })
   product_id: string;

   @ManyToOne(() => Product, product => product.sale_detail)
   @JoinColumn({ name: 'product_id' })
   product: Product;

   @Column({ type: 'uuid' })
   product_detail_id: string;

   @ManyToOne(() => ProductDetail, product_detail => product_detail.sale_detail)
   @JoinColumn({ name: 'product_detail_id' })
   product_detail: ProductDetail;

   @Column({ type: 'double' })
   total_item: number;

   @Column({ type: 'double' })
   price: number;

   @CreateDateColumn({ name: 'created_at' })
   created_at: Date;
 
   @UpdateDateColumn({ name: 'updated_at' })
   updated_at: Date;
 
   @DeleteDateColumn({ name: 'deleted_at' })
   deleted_at: Date;
   
   @BeforeInsert()
   private generateUUID() {
      if (!this.id) {
         this.id = uuidv4();
      }
   }
}
