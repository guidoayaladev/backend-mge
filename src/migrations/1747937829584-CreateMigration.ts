import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMigration1747937829584 implements MigrationInterface {
    name = 'CreateMigration1747937829584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organizational_units" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "project_id" uuid NOT NULL, CONSTRAINT "PK_d818d009beb8256752e477fe4c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transfers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "vehicle_id" uuid NOT NULL, "client_id" uuid NOT NULL, "transmitter_id" uuid NOT NULL, "project_id" uuid NOT NULL, "organizational_unit_id" uuid NOT NULL, CONSTRAINT "PK_f712e908b465e0085b4408cabc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vehicles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "plate" character varying NOT NULL, "service" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "projectId" uuid, CONSTRAINT "UQ_ec7181ebdab798d97070122a5bf" UNIQUE ("plate"), CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles_permissions_permissions" ("rolesId" uuid NOT NULL, "permissionsId" uuid NOT NULL, CONSTRAINT "PK_b2f4e3f7fbeb7e5b495dd819842" PRIMARY KEY ("rolesId", "permissionsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dc2b9d46195bb3ed28abbf7c9e" ON "roles_permissions_permissions" ("rolesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fd4d5d4c7f7ff16c57549b72c6" ON "roles_permissions_permissions" ("permissionsId") `);
        await queryRunner.query(`CREATE TABLE "users_projects_projects" ("usersId" uuid NOT NULL, "projectsId" uuid NOT NULL, CONSTRAINT "PK_a91f75f7e14f99fea39021e60c2" PRIMARY KEY ("usersId", "projectsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1adafab12f396fa125182f0756" ON "users_projects_projects" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a0922cc630203931d8048fce1d" ON "users_projects_projects" ("projectsId") `);
        await queryRunner.query(`CREATE TABLE "users_organizational_units_organizational_units" ("usersId" uuid NOT NULL, "organizationalUnitsId" uuid NOT NULL, CONSTRAINT "PK_5bea342e8f7f5a3e3c119dd92a8" PRIMARY KEY ("usersId", "organizationalUnitsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9cead92903347dd3fe61911ff9" ON "users_organizational_units_organizational_units" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_738044d105683b7eabe96d693c" ON "users_organizational_units_organizational_units" ("organizationalUnitsId") `);
        await queryRunner.query(`CREATE TABLE "users_roles_roles" ("usersId" uuid NOT NULL, "rolesId" uuid NOT NULL, CONSTRAINT "PK_6c1a055682c229f5a865f2080c1" PRIMARY KEY ("usersId", "rolesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_df951a64f09865171d2d7a502b" ON "users_roles_roles" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b2f0366aa9349789527e0c36d9" ON "users_roles_roles" ("rolesId") `);
        await queryRunner.query(`ALTER TABLE "organizational_units" ADD CONSTRAINT "FK_6fb51564b2e6694782fa742eaa3" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfers" ADD CONSTRAINT "FK_4a5eedc863f271f9a6c9a17dab3" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfers" ADD CONSTRAINT "FK_9249ca69c046f687f06bafa43bb" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfers" ADD CONSTRAINT "FK_b51bdb870765d09872dd4400451" FOREIGN KEY ("transmitter_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfers" ADD CONSTRAINT "FK_fc2701ec117b3be7833dd385de0" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfers" ADD CONSTRAINT "FK_74d763f971b949e14a946b2fbe8" FOREIGN KEY ("organizational_unit_id") REFERENCES "organizational_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD CONSTRAINT "FK_28298702fc91d5512f3afdc3384" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles_permissions_permissions" ADD CONSTRAINT "FK_dc2b9d46195bb3ed28abbf7c9e3" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "roles_permissions_permissions" ADD CONSTRAINT "FK_fd4d5d4c7f7ff16c57549b72c6f" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_projects_projects" ADD CONSTRAINT "FK_1adafab12f396fa125182f07564" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_projects_projects" ADD CONSTRAINT "FK_a0922cc630203931d8048fce1da" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_organizational_units_organizational_units" ADD CONSTRAINT "FK_9cead92903347dd3fe61911ff97" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_organizational_units_organizational_units" ADD CONSTRAINT "FK_738044d105683b7eabe96d693c5" FOREIGN KEY ("organizationalUnitsId") REFERENCES "organizational_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_roles_roles" ADD CONSTRAINT "FK_df951a64f09865171d2d7a502b1" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_roles_roles" ADD CONSTRAINT "FK_b2f0366aa9349789527e0c36d97" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_roles_roles" DROP CONSTRAINT "FK_b2f0366aa9349789527e0c36d97"`);
        await queryRunner.query(`ALTER TABLE "users_roles_roles" DROP CONSTRAINT "FK_df951a64f09865171d2d7a502b1"`);
        await queryRunner.query(`ALTER TABLE "users_organizational_units_organizational_units" DROP CONSTRAINT "FK_738044d105683b7eabe96d693c5"`);
        await queryRunner.query(`ALTER TABLE "users_organizational_units_organizational_units" DROP CONSTRAINT "FK_9cead92903347dd3fe61911ff97"`);
        await queryRunner.query(`ALTER TABLE "users_projects_projects" DROP CONSTRAINT "FK_a0922cc630203931d8048fce1da"`);
        await queryRunner.query(`ALTER TABLE "users_projects_projects" DROP CONSTRAINT "FK_1adafab12f396fa125182f07564"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions_permissions" DROP CONSTRAINT "FK_fd4d5d4c7f7ff16c57549b72c6f"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions_permissions" DROP CONSTRAINT "FK_dc2b9d46195bb3ed28abbf7c9e3"`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP CONSTRAINT "FK_28298702fc91d5512f3afdc3384"`);
        await queryRunner.query(`ALTER TABLE "transfers" DROP CONSTRAINT "FK_74d763f971b949e14a946b2fbe8"`);
        await queryRunner.query(`ALTER TABLE "transfers" DROP CONSTRAINT "FK_fc2701ec117b3be7833dd385de0"`);
        await queryRunner.query(`ALTER TABLE "transfers" DROP CONSTRAINT "FK_b51bdb870765d09872dd4400451"`);
        await queryRunner.query(`ALTER TABLE "transfers" DROP CONSTRAINT "FK_9249ca69c046f687f06bafa43bb"`);
        await queryRunner.query(`ALTER TABLE "transfers" DROP CONSTRAINT "FK_4a5eedc863f271f9a6c9a17dab3"`);
        await queryRunner.query(`ALTER TABLE "organizational_units" DROP CONSTRAINT "FK_6fb51564b2e6694782fa742eaa3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b2f0366aa9349789527e0c36d9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_df951a64f09865171d2d7a502b"`);
        await queryRunner.query(`DROP TABLE "users_roles_roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_738044d105683b7eabe96d693c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9cead92903347dd3fe61911ff9"`);
        await queryRunner.query(`DROP TABLE "users_organizational_units_organizational_units"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a0922cc630203931d8048fce1d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1adafab12f396fa125182f0756"`);
        await queryRunner.query(`DROP TABLE "users_projects_projects"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fd4d5d4c7f7ff16c57549b72c6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dc2b9d46195bb3ed28abbf7c9e"`);
        await queryRunner.query(`DROP TABLE "roles_permissions_permissions"`);
        await queryRunner.query(`DROP TABLE "vehicles"`);
        await queryRunner.query(`DROP TABLE "transfers"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TABLE "organizational_units"`);
    }

}
