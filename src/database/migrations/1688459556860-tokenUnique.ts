import { MigrationInterface, QueryRunner } from 'typeorm';

export class TokenUnique1688459556860 implements MigrationInterface {
  name = 'TokenUnique1688459556860';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_account" ADD CONSTRAINT "UQ_30601b5371100372bfc6923ce78" UNIQUE ("token")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_account" DROP CONSTRAINT "UQ_30601b5371100372bfc6923ce78"`,
    );
  }
}
