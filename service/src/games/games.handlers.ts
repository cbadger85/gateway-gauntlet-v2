import { RequestHandler } from 'express-serve-static-core';
import Container from 'typedi';
import CreateGameRequest from './createGameRequest.dto';
import AddPlayerRequest from './games.addPlayerRequest.dto';
import Game from './games.entity';
import GameService from './games.service';
import AuthenticateUser from '../auth/AuthenticateUser';
import { rbacConfig } from '../auth/rbacConfig';

export const createGame: RequestHandler<
  never,
  Game,
  CreateGameRequest
> = async (req, res) => {
  const gameService = Container.get(GameService);

  const game = await gameService.createGame(req.body);

  return res.json(game);
};

export const addPlayer: RequestHandler<
  { id: string },
  Game,
  AddPlayerRequest
> = async (req, res) => {
  const gameService = Container.get(GameService);

  const game = await gameService.addPlayer(req.params.id, req.body);

  return res.json(game);
};

export const authorizedToCreateGame = AuthenticateUser.of(rbacConfig)
  .can('game::create')
  .done();

export const authorizedToAddPlayer = AuthenticateUser.of(rbacConfig)
  .can('game::addPlayer')
  .done();
