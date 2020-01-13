import dotenv from 'dotenv';
import 'reflect-metadata';
import { Container } from 'typedi';
import {
  createConnection,
  useContainer,
  getConnectionOptions,
  ConnectionOptions,
} from 'typeorm';
import server, { app } from './server';

(async function Main() {
  dotenv.config();

  useContainer(Container);

  const ormConfig = await getConnectionOptions();

  const config: ConnectionOptions =
    process.env.NODE_ENV === 'production'
      ? {
          ...ormConfig,
          entities: ['dist/**/*entity.js'],
        }
      : ormConfig;

  await createConnection(config).catch(e => console.error(e));

  await server();

  const port = process.env.PORT || 4444;
  app.listen(port, () => {
    console.log(`App is listening on port: ${port}`);
  });
})();
