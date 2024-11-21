import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSaleDetailsTable1732090341797 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                CREATE TABLE sale_details (
                    id CHAR(36) PRIMARY KEY,
                    sales_id CHAR(36) NOT NULL,
                    product_id CHAR(36) NOT NULL,
                    product_detail_id CHAR(36) NOT NULL,
                    total_item INT NOT NULL,
                    price DOUBLE NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    deleted_at TIMESTAMP NULL,
                    updated_at TIMESTAMP NULL,
                    created_by CHAR(36) NULL,
                    deleted_by CHAR(36) NULL,
                    updated_by CHAR(36) NULL,
                    CONSTRAINT FK_sale_detail_sales FOREIGN KEY (sales_id)
                    REFERENCES sales (id) ON DELETE CASCADE,
                    CONSTRAINT FK_sale_detail_products FOREIGN KEY (product_id)
                    REFERENCES products (id) ON DELETE CASCADE,
                    CONSTRAINT FK_sale_detail_product_details FOREIGN KEY (product_detail_id)
                    REFERENCES product_details (id) ON DELETE CASCADE
                );
            `,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS sale_details`);
    }

}
