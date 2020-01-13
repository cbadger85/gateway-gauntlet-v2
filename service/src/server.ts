import express from 'express';
import bodyParser from 'body-parser';
import users from './users/users.routes';

export const app = express();

const server = async (): Promise<void> => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use('/users', users);
};

export default server;
