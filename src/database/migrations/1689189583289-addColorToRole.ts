import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColorToRole1689189583289 implements MigrationInterface {
    name = 'AddColorToRole1689189583289'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" ADD "color" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "color"`);
    }

}
