import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductCategoriesTable1732073162903 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                CREATE TABLE product_categories (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    name VARCHAR(100) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    deleted_at TIMESTAMP NULL,
                    updated_at TIMESTAMP NULL,
                    created_by CHAR(36) NULL,
                    deleted_by CHAR(36) NULL,
                    updated_by CHAR(36) NULL
                );
            `,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS product_categories`);
    }

}
