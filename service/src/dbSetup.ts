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

  console.log(getEmojiLog('🕺', 'Running migrations...'));
  const migrationExecutor = new MigrationExecutor(connection);

  await migrationExecutor.executePendingMigrations().catch(() => {
    console.log(getEmojiLog('💥', 'Migrations failed to run'));
  });

  console.log(getEmojiLog('🎉', 'Migrations successful'));

  return connection;
};

export default dbSetup;
