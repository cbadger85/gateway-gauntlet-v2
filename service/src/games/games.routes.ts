import express from 'express';
import { requestValidator } from '../handlers/requestValidator';
import CreateGameRequest from './createGameRequest.dto';
import { asyncHandler } from '../handlers/errorHandlers';
import {
  createGame,
  addPlayer,
  authorizedToCreateGame,
  authorizedToAddPlayer,
} from './games.handlers';
import { authenticateUser } from '../auth/auth.handlers';
import AddPlayerRequest from './games.addPlayerRequest.dto';
import { uuidParamValidator } from '../handlers/uuidParamValidator';

const gameRoutes = express.Router();

gameRoutes.post(
  '/',
  asyncHandler(authenticateUser),
  requestValidator(CreateGameRequest),
  asyncHandler(authorizedToCreateGame),
  asyncHandler(createGame),
);

gameRoutes.post(
  '/:id',
  asyncHandler(authenticateUser),
  requestValidator(AddPlayerRequest),
  asyncHandler(authorizedToAddPlayer),
  uuidParamValidator(),
  asyncHandler(addPlayer),
);

export default gameRoutes;
