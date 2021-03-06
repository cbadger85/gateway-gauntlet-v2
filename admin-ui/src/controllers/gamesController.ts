import axios from './axios';
import { Game, GameStatus } from '../types/Game';
import { AddTournamentFieldData } from '../components/AddTournamentForm';

const BASE_URL = `${process.env.REACT_APP_BASE_URL}/games`;

export const postGame = (game: AddTournamentFieldData): Promise<Game> =>
  axios.post<Game>(BASE_URL, game).then(res => res.data);

export const getGames = (): Promise<Game[]> =>
  axios.get<Game[]>(BASE_URL).then(res => res.data);

export const getGameById = (gameId: string): Promise<Game> =>
  axios.get<Game>(`${BASE_URL}/${gameId}`).then(res => res.data);

export const putPrice = (gameId: string, price: number): Promise<Game> =>
  axios
    .put<Game>(`${BASE_URL}/${gameId}/price`, { price })
    .then(res => res.data);

export const putDate = (
  gameId: string,
  date: Date,
  length?: number,
): Promise<Game> =>
  axios
    .put<Game>(`${BASE_URL}/${gameId}/date`, { date, length })
    .then(res => res.data);

export const putOrganizer = (
  gameId: string,
  organizerId: string,
): Promise<Game> =>
  axios
    .put<Game>(`${BASE_URL}/${gameId}/organizers`, { organizerId })
    .then(res => res.data);

export const putMissions = (
  gameId: string,
  missions: string[],
): Promise<Game> =>
  axios
    .put<Game>(`${BASE_URL}/${gameId}/missions`, { missions })
    .then(res => res.data);

export const postGameStatus = (
  gameId: string,
  status: GameStatus,
): Promise<undefined> =>
  axios
    .post<undefined>(`${BASE_URL}/${gameId}/status`, { status })
    .then(res => res.data);

export const deleteOrganizer = (
  gameId: string,
  organizerId: string,
): Promise<Game> =>
  axios
    .delete<Game>(`${BASE_URL}/${gameId}/organizers/${organizerId}`)
    .then(res => res.data);
