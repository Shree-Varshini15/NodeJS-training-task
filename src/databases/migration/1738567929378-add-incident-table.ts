import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIncidentTable1738567929378 implements MigrationInterface {
    name = 'AddIncidentTable1738567929378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."incidents_status_enum" AS ENUM('pending', 'active', 'completed')`);
        await queryRunner.query(`CREATE TABLE "incidents" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "location" character varying, "latitude" character varying, "longitude" character varying, "reportedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."incidents_status_enum" NOT NULL DEFAULT 'pending', "description" character varying, "incidentTypeId" integer, CONSTRAINT "PK_ccb34c01719889017e2246469f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "incidents" ADD CONSTRAINT "FK_d698f357676d1e22fb3cb6437a9" FOREIGN KEY ("incidentTypeId") REFERENCES "incident_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "incidents" DROP CONSTRAINT "FK_d698f357676d1e22fb3cb6437a9"`);
        await queryRunner.query(`DROP TABLE "incidents"`);
        await queryRunner.query(`DROP TYPE "public"."incidents_status_enum"`);
    }

}
