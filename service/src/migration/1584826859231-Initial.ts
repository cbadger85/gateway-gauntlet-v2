import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1584826859231 implements MigrationInterface {
  name = 'Initial1584826859231';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "temporary_player" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "itsName" varchar NOT NULL, "itsPin" varchar NOT NULL, "email" varchar NOT NULL, "city" varchar NOT NULL, "state" varchar NOT NULL, "paid" boolean NOT NULL, "attending" boolean NOT NULL, "shortCode" varchar NOT NULL, "gameId" varchar, CONSTRAINT "UQ_ddeecffd0d932212fefe8d9e9fa" UNIQUE ("itsPin"), CONSTRAINT "FK_7dfdd31fcd2b5aa3b08ed15fe8a" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
      undefined,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_player"("id", "name", "itsName", "itsPin", "email", "city", "state", "paid", "attending", "shortCode", "gameId") SELECT "id", "name", "itsName", "itsPin", "email", "city", "state", "paid", "attending", "shortCode", "gameId" FROM "player"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "player"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "temporary_player" RENAME TO "player"`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_player" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "itsName" varchar NOT NULL, "itsPin" varchar NOT NULL, "email" varchar NOT NULL, "city" varchar NOT NULL, "state" varchar NOT NULL, "paid" boolean NOT NULL, "attending" boolean NOT NULL, "shortCode" varchar NOT NULL, "gameId" varchar, CONSTRAINT "UQ_ddeecffd0d932212fefe8d9e9fa" UNIQUE ("itsPin"), CONSTRAINT "FK_7dfdd31fcd2b5aa3b08ed15fe8a" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
      undefined,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_player"("id", "name", "itsName", "itsPin", "email", "city", "state", "paid", "attending", "shortCode", "gameId") SELECT "id", "name", "itsName", "itsPin", "email", "city", "state", "paid", "attending", "shortCode", "gameId" FROM "player"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "player"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "temporary_player" RENAME TO "player"`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "player" RENAME TO "temporary_player"`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "player" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "itsName" varchar NOT NULL, "itsPin" varchar NOT NULL, "email" varchar NOT NULL, "city" varchar NOT NULL, "state" varchar NOT NULL, "paid" boolean NOT NULL, "attending" boolean NOT NULL, "shortCode" varchar NOT NULL, "gameId" varchar, CONSTRAINT "UQ_ddeecffd0d932212fefe8d9e9fa" UNIQUE ("itsPin"), CONSTRAINT "FK_7dfdd31fcd2b5aa3b08ed15fe8a" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
      undefined,
    );
    await queryRunner.query(
      `INSERT INTO "player"("id", "name", "itsName", "itsPin", "email", "city", "state", "paid", "attending", "shortCode", "gameId") SELECT "id", "name", "itsName", "itsPin", "email", "city", "state", "paid", "attending", "shortCode", "gameId" FROM "temporary_player"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "temporary_player"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "player" RENAME TO "temporary_player"`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "player" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "itsName" varchar NOT NULL, "itsPin" varchar NOT NULL, "email" varchar NOT NULL, "city" varchar NOT NULL, "state" varchar NOT NULL, "paid" boolean NOT NULL, "attending" boolean NOT NULL, "shortCode" varchar NOT NULL, "gameId" varchar, CONSTRAINT "UQ_ddeecffd0d932212fefe8d9e9fa" UNIQUE ("itsPin"), CONSTRAINT "FK_7dfdd31fcd2b5aa3b08ed15fe8a" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
      undefined,
    );
    await queryRunner.query(
      `INSERT INTO "player"("id", "name", "itsName", "itsPin", "email", "city", "state", "paid", "attending", "shortCode", "gameId") SELECT "id", "name", "itsName", "itsPin", "email", "city", "state", "paid", "attending", "shortCode", "gameId" FROM "temporary_player"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "temporary_player"`, undefined);
  }
}
