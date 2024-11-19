import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMUserTable1712302094490 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
        `
            CREATE TABLE users (
                id CHAR(36) PRIMARY KEY,
                email VARCHAR(255) UNIQUE,
                username VARCHAR(100),
                password VARCHAR(255),
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
    await queryRunner.dropTable('users');
  }

}
