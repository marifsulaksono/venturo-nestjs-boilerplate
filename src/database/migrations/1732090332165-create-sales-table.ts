import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSalesTable1732090332165 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                CREATE TABLE sales (
                    id CHAR(36) PRIMARY KEY,
                    customer_id CHAR(36) NOT NULL,
                    total DOUBLE DEFAULT 0 NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    deleted_at TIMESTAMP NULL,
                    updated_at TIMESTAMP NULL,
                    created_by CHAR(36) NULL,
                    deleted_by CHAR(36) NULL,
                    updated_by CHAR(36) NULL,
                    CONSTRAINT FK_customer_sales FOREIGN KEY (customer_id)
                    REFERENCES customers (id) ON DELETE CASCADE
                );
            `,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS sales`);
    }

}
