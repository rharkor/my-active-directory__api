import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDescToSA1689702014707 implements MigrationInterface {
    name = 'AddDescToSA1689702014707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_account" ADD "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_account" DROP COLUMN "description"`);
    }

}
