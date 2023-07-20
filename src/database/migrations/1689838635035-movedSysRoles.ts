import { MigrationInterface, QueryRunner } from 'typeorm';

export class MovedSysRoles1689838635035 implements MigrationInterface {
  name = 'MovedSysRoles1689838635035';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sys_role" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "displayName" character varying NOT NULL, "description" character varying, "color" character varying, CONSTRAINT "UQ_223de54d6badbe43a5490450c30" UNIQUE ("name"), CONSTRAINT "PK_12875ba0686cf845f353704dc7b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_sysroles_sys_role" ("userId" integer NOT NULL, "sysRoleId" integer NOT NULL, CONSTRAINT "PK_efbbfefc26c1d448ca596367d6e" PRIMARY KEY ("userId", "sysRoleId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e5f6e56408f8b2861f5a5a0865" ON "user_sysroles_sys_role" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9ae462c82f79fc0df05bda0370" ON "user_sysroles_sys_role" ("sysRoleId") `,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "deletable"`);
    await queryRunner.query(
      `ALTER TABLE "user_sysroles_sys_role" ADD CONSTRAINT "FK_e5f6e56408f8b2861f5a5a08653" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_sysroles_sys_role" ADD CONSTRAINT "FK_9ae462c82f79fc0df05bda03708" FOREIGN KEY ("sysRoleId") REFERENCES "sys_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_sysroles_sys_role" DROP CONSTRAINT "FK_9ae462c82f79fc0df05bda03708"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_sysroles_sys_role" DROP CONSTRAINT "FK_e5f6e56408f8b2861f5a5a08653"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD "deletable" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9ae462c82f79fc0df05bda0370"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e5f6e56408f8b2861f5a5a0865"`,
    );
    await queryRunner.query(`DROP TABLE "user_sysroles_sys_role"`);
    await queryRunner.query(`DROP TABLE "sys_role"`);
  }
}
