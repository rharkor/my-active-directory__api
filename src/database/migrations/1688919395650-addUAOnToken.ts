import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUAOnToken1688919395650 implements MigrationInterface {
    name = 'AddUAOnToken1688919395650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`);
        await queryRunner.query(`ALTER TABLE "token" ADD "userAgent" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "userAgent" UNIQUE ("userAgent", "userId")`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "userAgent"`);
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "userAgent"`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
