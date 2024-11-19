import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMRolesTable1712307421281 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id VARCHAR(36) NOT NULL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                access LONGTEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL,
                created_by CHAR(36) NULL,
                deleted_by CHAR(36) NULL,
                updated_by CHAR(36) NULL
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS roles`);
    }

}
