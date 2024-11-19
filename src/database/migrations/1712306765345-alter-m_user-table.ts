import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterMUserTable1712306765345 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE users
            ADD COLUMN role_id CHAR(36) NULL AFTER password;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE users
            DROP COLUMN role_id;
        `);
    }

}
