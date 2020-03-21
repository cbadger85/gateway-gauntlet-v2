import { Container } from 'typedi';
import { Connection, createConnection, useContainer } from 'typeorm';
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

  return connection;
};

export default dbSetup;
