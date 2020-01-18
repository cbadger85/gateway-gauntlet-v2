import express from 'express';
import bodyParser from 'body-parser';
import users from './users/users.routes';
import { Express } from 'express-serve-static-core';
import errorHandlers from './handlers/errorHandlers';

const app = express();

export const server = async (): Promise<Express> => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use('/users', users);

  app.use(errorHandlers);

  return app;
};

export default server;
