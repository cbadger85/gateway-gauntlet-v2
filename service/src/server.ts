import express from 'express';
import bodyParser from 'body-parser';
import users from './users/users.routes';
import { Express } from 'express-serve-static-core';

const app = express();

export const server = async (): Promise<Express> => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use('/users', users);

  return app;
};

export default server;
