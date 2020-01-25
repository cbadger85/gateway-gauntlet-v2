import { Container } from 'typedi';
import {
  createConnection,
  useContainer,
  getConnectionOptions,
  ConnectionOptions,
  Connection,
} from 'typeorm';

export const dbSetup = async (): Promise<Connection> => {
  console.log('🐬'.padEnd(4), 'Setting up database...');
  useContainer(Container);

  const ormConfig = await getConnectionOptions();

  const config: ConnectionOptions =
    process.env.NODE_ENV === 'production'
      ? {
          ...ormConfig,
          entities: ['dist/**/*entity.js'],
        }
      : ormConfig;

  const connection = await createConnection(config).catch(e => {
    console.error(e);
  });
  console.log('🎉'.padEnd(4), 'Database connected!');

  if (!connection) {
    throw new Error('💥'.padEnd(4) + 'Failed to connect');
  }

  return connection;
};

export default dbSetup;
