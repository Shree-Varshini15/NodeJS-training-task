import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedEnumValidationToUser1738316546427 implements MigrationInterface {
    name = 'AddedEnumValidationToUser1738316546427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "dummy"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "dummy" character varying NOT NULL DEFAULT 'fire_fighter'`);
    }

}
