import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProject1689851634853 implements MigrationInterface {
    name = 'AddProject1689851634853'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "color" character varying, CONSTRAINT "UQ_dedfea394088ed136ddadeee89c" UNIQUE ("name"), CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "service_account_projects_project" ("serviceAccountId" integer NOT NULL, "projectId" integer NOT NULL, CONSTRAINT "PK_34df36bc5e9e42a7461bc57c075" PRIMARY KEY ("serviceAccountId", "projectId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2fea88ade4b7d611264ec00448" ON "service_account_projects_project" ("serviceAccountId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d3c22899719003ae393bbd0c30" ON "service_account_projects_project" ("projectId") `);
        await queryRunner.query(`CREATE TABLE "user_projects_project" ("userId" integer NOT NULL, "projectId" integer NOT NULL, CONSTRAINT "PK_26a180af1ec7a8550f5c374fcd8" PRIMARY KEY ("userId", "projectId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_79daf0d2be103f4c30c77ddd6b" ON "user_projects_project" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_936561888bfd63d01c79fe415c" ON "user_projects_project" ("projectId") `);
        await queryRunner.query(`ALTER TABLE "service_account_projects_project" ADD CONSTRAINT "FK_2fea88ade4b7d611264ec004485" FOREIGN KEY ("serviceAccountId") REFERENCES "service_account"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "service_account_projects_project" ADD CONSTRAINT "FK_d3c22899719003ae393bbd0c30d" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_projects_project" ADD CONSTRAINT "FK_79daf0d2be103f4c30c77ddd6be" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_projects_project" ADD CONSTRAINT "FK_936561888bfd63d01c79fe415c3" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_projects_project" DROP CONSTRAINT "FK_936561888bfd63d01c79fe415c3"`);
        await queryRunner.query(`ALTER TABLE "user_projects_project" DROP CONSTRAINT "FK_79daf0d2be103f4c30c77ddd6be"`);
        await queryRunner.query(`ALTER TABLE "service_account_projects_project" DROP CONSTRAINT "FK_d3c22899719003ae393bbd0c30d"`);
        await queryRunner.query(`ALTER TABLE "service_account_projects_project" DROP CONSTRAINT "FK_2fea88ade4b7d611264ec004485"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_936561888bfd63d01c79fe415c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_79daf0d2be103f4c30c77ddd6b"`);
        await queryRunner.query(`DROP TABLE "user_projects_project"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d3c22899719003ae393bbd0c30"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2fea88ade4b7d611264ec00448"`);
        await queryRunner.query(`DROP TABLE "service_account_projects_project"`);
        await queryRunner.query(`DROP TABLE "project"`);
    }

}
