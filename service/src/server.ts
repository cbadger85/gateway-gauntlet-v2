import express from 'express';
import bodyParser from 'body-parser';
import users from './users/users.routes';
import { Express } from 'express-serve-static-core';
<<<<<<< HEAD
import errorHandlers from './handlers/errorHandlers';
=======
import { errorHandler } from './handlers/errorHandlers';
>>>>>>> 7933dce725e745ce59aa56c53b797d2b11a06f2c

const app = express();

export const server = async (): Promise<Express> => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use('/users', users);

<<<<<<< HEAD
  app.use(errorHandlers);
=======
  app.use(errorHandler);
>>>>>>> 7933dce725e745ce59aa56c53b797d2b11a06f2c

  return app;
};

export default server;
