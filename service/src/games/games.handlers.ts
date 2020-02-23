import { RequestHandler } from 'express-serve-static-core';
import Container from 'typedi';
import { authorizeUser } from '../handlers/authorizeUser';
import CreateGameRequest from './createGameRequest.dto';
import AddPlayerRequest from './games.addPlayerRequest.dto';
import Game from './games.entity';
import GameService from './games.service';
import OrganizerRequest from './organizerRequest.dto';

export const getGames: RequestHandler<never, Game[], never> = async (
  req,
  res,
) => {
  const gameService = Container.get(GameService);

  const games = await gameService.getGames();

  return res.json(games);
};

export const getGame: RequestHandler<{ gameId: string }, Game, never> = async (
  req,
  res,
) => {
  const gameService = Container.get(GameService);

  const game = await gameService.getGame(req.params.gameId);

  return res.json(game);
};

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
  { gameId: string },
  Game,
  AddPlayerRequest
> = async (req, res) => {
  const gameService = Container.get(GameService);

  const game = await gameService.addPlayer(req.params.gameId, req.body);

  return res.json(game);
};

export const addOrganizer: RequestHandler<
  { gameId: string },
  Game,
  OrganizerRequest
> = async (req, res) => {
  const gameService = Container.get(GameService);

  const game = await gameService.addOrganizer(
    req.params.gameId,
    req.body.organizerId,
  );

  return res.json(game);
};

export const removeOrganizer: RequestHandler<
  { gameId: string; organizerId: string },
  Game,
  never
> = async (req, res) => {
  const gameService = Container.get(GameService);

  const game = await gameService.removeOrganizer(
    req.params.gameId,
    req.params.organizerId,
  );

  return res.json(game);
};

export const authorizedToCreateGame = authorizeUser('game::create');

export const authorizedToReadGames = authorizeUser('game::read');

export const authorizedToUpdateGame = authorizeUser('game::update');

export const authorizedToAddPlayer = authorizeUser('game::addPlayer');
