import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTokenAuthTable1732246917453 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS token_auth (
                token TEXT NOT NULL,
                user_id CHAR(36) NOT NULL,
                ip CHAR(50) NOT NULL,
                CONSTRAINT unique_user_ip UNIQUE (user_id, ip)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE IF EXISTS token_auth')
    }

}
