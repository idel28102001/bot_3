import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1667824424004 implements MigrationInterface {
    name = 'migration1667824424004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "stage" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "stage"`);
    }

}
