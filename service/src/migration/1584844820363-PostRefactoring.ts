import {MigrationInterface, QueryRunner} from "typeorm";

export class PostRefactoring1584844820363 implements MigrationInterface {
    name = 'PostRefactoring1584844820363'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "temporary_player" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "itsName" varchar NOT NULL, "itsPin" varchar NOT NULL, "email" varchar NOT NULL, "city" varchar NOT NULL, "state" varchar NOT NULL, "paid" boolean NOT NULL, "attending" boolean NOT NULL, "shortCode" varchar NOT NULL, "gameId" varchar, CONSTRAINT "UQ_ddeecffd0d932212fefe8d9e9fa" UNIQUE ("itsPin"), CONSTRAINT "FK_7dfdd31fcd2b5aa3b08ed15fe8a" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_player"("id", "name", "itsName", "itsPin", "email", "city", "state", "paid", "attending", "shortCode", "gameId") SELECT "id", "name", "itsName", "itsPin", "email", "city", "state", "paid", "attending", "shortCode", "gameId" FROM "player"`, undefined);
        await queryRunner.query(`DROP TABLE "player"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_player" RENAME TO "player"`, undefined);
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "username" varchar NOT NULL, "password" varchar, "passwordExpiration" date, "passwordResetId" varchar, "email" varchar NOT NULL, "roles" text NOT NULL, "sessionId" varchar, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`, undefined);
        await queryRunner.query(`CREATE TABLE "game_users_users" ("gameId" varchar NOT NULL, "usersId" varchar NOT NULL, PRIMARY KEY ("gameId", "usersId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_5bf9d5007365f7cd2f19cfc1be" ON "game_users_users" ("gameId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_5dfc23f8932c6a72e177940b56" ON "game_users_users" ("usersId") `, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_player" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "itsName" varchar NOT NULL, "itsPin" varchar NOT NULL, "email" varchar NOT NULL, "city" varchar NOT NULL, "state" varchar NOT NULL, "paid" boolean NOT NULL, "attending" boolean NOT NULL, "shortCode" varchar NOT NULL, "gameId" varchar, CONSTRAINT "UQ_ddeecffd0d932212fefe8d9e9fa" UNIQUE ("itsPin"), CONSTRAINT "FK_7dfdd31fcd2b5aa3b08ed15fe8a" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_player"("id", "name", "itsName", "itsPin", "email", "city", "state", "paid", "attending", "shortCode", "gameId") SELECT "id", "name", "itsName", "itsPin", "email", "city", "state", "paid", "attending", "shortCode", "gameId" FROM "player"`, undefined);
        await queryRunner.query(`DROP TABLE "player"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_player" RENAME TO "player"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_5bf9d5007365f7cd2f19cfc1be"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_5dfc23f8932c6a72e177940b56"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_game_users_users" ("gameId" varchar NOT NULL, "usersId" varchar NOT NULL, CONSTRAINT "FK_5bf9d5007365f7cd2f19cfc1bef" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_5dfc23f8932c6a72e177940b560" FOREIGN KEY ("usersId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("gameId", "usersId"))`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_game_users_users"("gameId", "usersId") SELECT "gameId", "usersId" FROM "game_users_users"`, undefined);
        await queryRunner.query(`DROP TABLE "game_users_users"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_game_users_users" RENAME TO "game_users_users"`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_5bf9d5007365f7cd2f19cfc1be" ON "game_users_users" ("gameId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_5dfc23f8932c6a72e177940b56" ON "game_users_users" ("usersId") `, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_5dfc23f8932c6a72e177940b56"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_5bf9d5007365f7cd2f19cfc1be"`, undefined);
        await queryRunner.query(`ALTER TABLE "game_users_users" RENAME TO "temporary_game_users_users"`, undefined);
        await queryRunner.query(`CREATE TABLE "game_users_users" ("gameId" varchar NOT NULL, "usersId" varchar NOT NULL, PRIMARY KEY ("gameId", "usersId"))`, undefined);
        await queryRunner.query(`INSERT INTO "game_users_users"("gameId", "usersId") SELECT "gameId", "usersId" FROM "temporary_game_users_users"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_game_users_users"`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_5dfc23f8932c6a72e177940b56" ON "game_users_users" ("usersId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_5bf9d5007365f7cd2f19cfc1be" ON "game_users_users" ("gameId") `, undefined);
        await queryRunner.query(`ALTER TABLE "player" RENAME TO "temporary_player"`, undefined);
        await queryRunner.query(`CREATE TABLE "player" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "itsName" varchar NOT NULL, "itsPin" varchar NOT NULL, "email" varchar NOT NULL, "city" varchar NOT NULL, "state" varchar NOT NULL, "paid" boolean NOT NULL, "attending" boolean NOT NULL, "shortCode" varchar NOT NULL, "gameId" varchar, CONSTRAINT "UQ_ddeecffd0d932212fefe8d9e9fa" UNIQUE ("itsPin"), CONSTRAINT "FK_7dfdd31fcd2b5aa3b08ed15fe8a" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "player"("id", "name", "itsName", "itsPin", "email", "city", "state", "paid", "attending", "shortCode", "gameId") SELECT "id", "name", "itsName", "itsPin", "email", "city", "state", "paid", "attending", "shortCode", "gameId" FROM "temporary_player"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_player"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_5dfc23f8932c6a72e177940b56"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_5bf9d5007365f7cd2f19cfc1be"`, undefined);
        await queryRunner.query(`DROP TABLE "game_users_users"`, undefined);
        await queryRunner.query(`DROP TABLE "users"`, undefined);
        await queryRunner.query(`ALTER TABLE "player" RENAME TO "temporary_player"`, undefined);
        await queryRunner.query(`CREATE TABLE "player" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "itsName" varchar NOT NULL, "itsPin" varchar NOT NULL, "email" varchar NOT NULL, "city" varchar NOT NULL, "state" varchar NOT NULL, "paid" boolean NOT NULL, "attending" boolean NOT NULL, "shortCode" varchar NOT NULL, "gameId" varchar, CONSTRAINT "UQ_ddeecffd0d932212fefe8d9e9fa" UNIQUE ("itsPin"), CONSTRAINT "FK_7dfdd31fcd2b5aa3b08ed15fe8a" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "player"("id", "name", "itsName", "itsPin", "email", "city", "state", "paid", "attending", "shortCode", "gameId") SELECT "id", "name", "itsName", "itsPin", "email", "city", "state", "paid", "attending", "shortCode", "gameId" FROM "temporary_player"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_player"`, undefined);
    }

}
