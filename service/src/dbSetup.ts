import { Container } from 'typedi';
import {
  createConnection,
  useContainer,
  getConnectionOptions,
  ConnectionOptions,
} from 'typeorm';

const dbSetup = async (): Promise<void> => {
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

  await createConnection(config).catch(e => {
    console.log('💥'.padEnd(4), 'Failed to connect');
    console.error(e);
  });
  console.log('🎉'.padEnd(4), 'Database connected!');
};

export default dbSetup;
