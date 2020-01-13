import dotenv from 'dotenv';
import 'reflect-metadata';
import { Container } from 'typedi';
import { createConnection, useContainer } from 'typeorm';
import server, { app } from './server';

dotenv.config();

useContainer(Container);
createConnection().catch(e => console.error(e));

server();

const port = process.env.PORT || 4444;
app.listen(port, () => {
  console.log(`App is listening on port: ${port}`);
});
