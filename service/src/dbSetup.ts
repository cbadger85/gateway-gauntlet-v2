import { Container } from 'typedi';
import {
  createConnection,
  useContainer,
  Connection,
  ConnectionOptions,
} from 'typeorm';

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
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
};

export const dbSetup = async (): Promise<Connection> => {
  console.log('🐬'.padEnd(4), 'Setting up database...');
  useContainer(Container);

  const config =
    process.env.NODE_ENV === 'production' ? prodOptions : devOptions;

  console.log(config);

  const connection = await createConnection(config).catch(e => {
    console.error(e);
  });

  if (!connection) {
    throw new Error('💥'.padEnd(4) + 'Failed to connect');
  }

  console.log('🎉'.padEnd(4), 'Database connected!');

  return connection;
};

export default dbSetup;
