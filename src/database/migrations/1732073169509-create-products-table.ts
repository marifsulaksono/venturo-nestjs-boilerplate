import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductsTable1732073169509 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                CREATE TABLE products (
                    id CHAR(36) PRIMARY KEY,
                    product_category_id INT NOT NULL,
                    name VARCHAR(150) NOT NULL,
                    price DOUBLE NOT NULL,
                    description VARCHAR(500),
                    photo TEXT,
                    is_available BOOLEAN DEFAULT true,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    deleted_at TIMESTAMP NULL,
                    updated_at TIMESTAMP NULL,
                    created_by CHAR(36) NULL,
                    deleted_by CHAR(36) NULL,
                    updated_by CHAR(36) NULL,
                    CONSTRAINT FK_product_category FOREIGN KEY (product_category_id)
                    REFERENCES product_categories (id) ON DELETE CASCADE
                );
            `,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS products`);
    }

}
