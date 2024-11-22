import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductDetailsTable1732073485968 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                CREATE TABLE product_details (
                    id CHAR(36) PRIMARY KEY,
                    product_id CHAR(36) NOT NULL,
                    type VARCHAR(150) NOT NULL,
                    description VARCHAR(500),
                    price DOUBLE NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    deleted_at TIMESTAMP NULL,
                    updated_at TIMESTAMP NULL,
                    created_by CHAR(36) NULL,
                    deleted_by CHAR(36) NULL,
                    updated_by CHAR(36) NULL,
                    CONSTRAINT FK_product_detail_product FOREIGN KEY (product_id)
                    REFERENCES products (id) ON DELETE CASCADE
                );
            `,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS product_details`);
    }

}
