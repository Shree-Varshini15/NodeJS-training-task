import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotificationsTable1738568744833 implements MigrationInterface {
    name = 'AddNotificationsTable1738568744833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "senderId" integer, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_ddb7981cf939fe620179bfea33a" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_ddb7981cf939fe620179bfea33a"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
    }

}
