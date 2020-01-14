import dotenv from 'dotenv';
import 'reflect-metadata';
import dbSetup from './dbSetup';
import server, { app } from './server';

export default (async function Main() {
  console.log('🔗'.padEnd(4), 'Initializing app...');
  dotenv.config();

  await dbSetup();

  await server();

  const port = process.env.PORT || 4444;
  app.listen(port, () => {
    console.log('👂'.padEnd(4), `App is listening on port: ${port}`);
  });
})();
