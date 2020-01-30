import { Container } from 'typedi';
import { createConnection, useContainer, Connection } from 'typeorm';
import { prodOptions, devOptions } from './ormconfig';

export const dbSetup = async (): Promise<Connection> => {
  console.log('🐬'.padEnd(4), 'Setting up database...');
  useContainer(Container);

  const config =
    process.env.NODE_ENV === 'production' ? prodOptions : devOptions;

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
