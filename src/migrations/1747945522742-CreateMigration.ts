import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMigration1747945522742 implements MigrationInterface {
    name = 'CreateMigration1747945522742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "UQ_2187088ab5ef2a918473cb99007" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "UQ_2187088ab5ef2a918473cb99007"`);
    }

}
