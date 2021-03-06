import { RequestHandler } from 'express-serve-static-core';
import Container from 'typedi';
import { authorizeUser } from '../handlers/authorizeUser';
import CreateGameRequest from './createGameRequest.dto';
import UpdatePriceRequest from './updatePriceRequest.dto';
import AddPlayerRequest from './games.addPlayerRequest.dto';
import Game from './games.entity';
import GameService from './games.service';
import OrganizerRequest from './organizerRequest.dto';
import UpdateDateRequest from './updateDateRequest.dto';
import UpdateMissionsRequest from './updateMissionsRequest.dto';
import UpdateGameStatusRequest from './updateGameStatusRequest.dto';

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

export const updatePrice: RequestHandler<
  { gameId: string },
  Game,
  UpdatePriceRequest
> = async (req, res) => {
  const gameService = Container.get(GameService);

  const game = await gameService.updatePrice(req.params.gameId, req.body.price);

  return res.json(game);
};

export const updateDate: RequestHandler<
  { gameId: string },
  Game,
  UpdateDateRequest
> = async (req, res) => {
  const gameService = Container.get(GameService);

  const game = await gameService.updateDate(
    req.params.gameId,
    req.body.date,
    req.body.length,
  );

  return res.json(game);
};

export const updateMissions: RequestHandler<
  { gameId: string },
  Game,
  UpdateMissionsRequest
> = async (req, res) => {
  const gameService = Container.get(GameService);

  const game = await gameService.updateMissions(
    req.params.gameId,
    req.body.missions,
  );

  return res.json(game);
};

export const updateGameStatus: RequestHandler<
  { gameId: string },
  Game,
  UpdateGameStatusRequest
> = async (req, res) => {
  const gameService = Container.get(GameService);

  await gameService.updateGameStatus(req.params.gameId, req.body.status);

  return res.sendStatus(204);
};

export const authorizedToCreateGame = authorizeUser('game::create');

export const authorizedToReadGames = authorizeUser('game::read');

export const authorizedToUpdateGame = authorizeUser('game::update');

export const authorizedToAddPlayer = authorizeUser('game::addPlayer');
