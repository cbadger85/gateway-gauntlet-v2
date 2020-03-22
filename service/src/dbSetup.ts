import { Container } from 'typedi';
import {
  Connection,
  createConnection,
  useContainer,
  MigrationExecutor,
} from 'typeorm';
import { getEmojiLog } from './utils/getEmojiLog';

export const dbSetup = async (): Promise<Connection> => {
  console.log(getEmojiLog('🐬', 'Setting up database...'));
  useContainer(Container);

  const connection = await createConnection().catch(e => {
    console.error(e);
  });

  if (!connection) {
    throw new Error(getEmojiLog('💥', 'Failed to connect'));
  }

  console.log(getEmojiLog('🎉', 'Database connected!'));

  const migrationExecutor = new MigrationExecutor(connection);

  const migrations = await migrationExecutor.getAllMigrations();

  migrations.forEach(async migration => {
    console.log(getEmojiLog('🕺', `Running migration ${migration.name}`));
    await migrationExecutor.executeMigration(migration);
    console.log(getEmojiLog('🎉', `Migration ${migration.name} successful`));
  });

  return connection;
};

export default dbSetup;
