import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import users from './users/users.routes';
import auth from './auth/auth.routes';
import games from './games/games.routes';
import organizers from './organizers/organizers.routes';
import { Express } from 'express-serve-static-core';
import errorHandlers from './handlers/errorHandlers';
import { serverTimout } from './handlers/serverTimeout';
import { requestLogger } from './handlers/requestLogger';

const app = express();

export const server = async (): Promise<Express> => {
  app.use(serverTimout());

  app.use(
    cors({
      credentials: true,
      allowedHeaders: 'x-access-token,x-refresh-token,content-type',
      exposedHeaders: 'x-access-token,x-refresh-token',
    }),
  );

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(cookieParser());

  app.use(requestLogger);

  app.use('/users', users);
  app.use('/auth', auth);
  app.use('/games', games);
  app.use('/organizers', organizers);

  app.use(errorHandlers);

  return app;
};

export default server;
