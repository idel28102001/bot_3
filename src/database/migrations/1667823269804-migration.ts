import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1667823269804 implements MigrationInterface {
    name = 'migration1667823269804'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying, "last_name" character varying, "username" character varying, "telegramId" character varying NOT NULL, CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_entity"`);
    }

}
