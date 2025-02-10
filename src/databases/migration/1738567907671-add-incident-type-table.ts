import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIncidentTypeTable1738567907671 implements MigrationInterface {
    name = 'AddIncidentTypeTable1738567907671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "incident_type" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5a8002731cddeb0825c3ae17c79" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "incident_type"`);
    }

}
