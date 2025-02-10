import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNotificationColumnName1738571191184 implements MigrationInterface {
    name = 'UpdateNotificationColumnName1738571191184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_ddb7981cf939fe620179bfea33a"`);
        await queryRunner.query(`ALTER TABLE "notifications" RENAME COLUMN "senderId" TO "sender_id"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_4140c8b09ff58165daffbefbd7e" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_4140c8b09ff58165daffbefbd7e"`);
        await queryRunner.query(`ALTER TABLE "notifications" RENAME COLUMN "sender_id" TO "senderId"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_ddb7981cf939fe620179bfea33a" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
