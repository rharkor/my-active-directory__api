import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldToToken1688926645021 implements MigrationInterface {
    name = 'AddFieldToToken1688926645021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" ADD "lastUsed" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "token" ADD "createdAt" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "token" ADD "expiresAt" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "token" ADD "createdByIp" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "createdByIp"`);
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "lastUsed"`);
    }

}
