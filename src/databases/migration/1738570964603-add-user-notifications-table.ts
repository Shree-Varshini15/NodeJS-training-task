import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserNotificationsTable1738570964603 implements MigrationInterface {
    name = 'AddUserNotificationsTable1738570964603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_notifications" ("id" SERIAL NOT NULL, "read_at" TIMESTAMP, "user_id" integer, "notification_id" integer, CONSTRAINT "PK_569622b0fd6e6ab3661de985a2b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_notifications" ADD CONSTRAINT "FK_ae9b1d1f1fe780ef8e3e7d0c0f6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_notifications" ADD CONSTRAINT "FK_944431ae979397c8b56a99bf024" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_notifications" DROP CONSTRAINT "FK_944431ae979397c8b56a99bf024"`);
        await queryRunner.query(`ALTER TABLE "user_notifications" DROP CONSTRAINT "FK_ae9b1d1f1fe780ef8e3e7d0c0f6"`);
        await queryRunner.query(`DROP TABLE "user_notifications"`);
    }

}
