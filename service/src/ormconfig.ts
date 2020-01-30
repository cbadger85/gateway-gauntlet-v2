import { ConnectionOptions } from 'typeorm';

export const devOptions: ConnectionOptions = {
  synchronize: true,
  logging: false,
  type: 'sqlite',
  database: './db.sql',
  entities: ['src/**/*entity.ts'],
  migrations: ['src/migration/**/*.ts'],
  cli: {
    entitiesDir: 'src/**',
    migrationsDir: 'src/migration',
  },
};

export const prodOptions: ConnectionOptions = {
  type: 'postgres',
  entities: ['dist/**/*entity.js'],
  synchronize: true,
  url: process.env.DB_URI,
  username: process.env.DB_USERNAME,
  password: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
};
