import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCustomersTable1732017757297 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                CREATE TABLE customers (
                    id CHAR(36) PRIMARY KEY,
                    user_id CHAR(36) not null,
                    name VARCHAR(150),
                    phonenumber VARCHAR(30),
                    address VARCHAR(500),
                    photo TEXT,
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
    }

}
