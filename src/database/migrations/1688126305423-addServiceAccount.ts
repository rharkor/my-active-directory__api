import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddServiceAccount1688126305423 implements MigrationInterface {
  name = 'AddServiceAccount1688126305423';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "service_account" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "token" character varying NOT NULL, CONSTRAINT "UQ_1c270dede67ac9b2534a0846521" UNIQUE ("name"), CONSTRAINT "PK_2efb318de61f6487f806627dbd2" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "service_account"`);
  }
}
