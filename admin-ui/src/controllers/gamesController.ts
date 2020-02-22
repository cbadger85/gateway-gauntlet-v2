import axios from './axios';
import { Game } from '../types/Game';
import { AddTournamentFieldData } from '../components/AddTournamentForm';

const BASE_URL = `${process.env.REACT_APP_BASE_URL}/games`;

export const postGame = (game: AddTournamentFieldData): Promise<Game> =>
  axios.post<Game>(BASE_URL, game).then(res => res.data);

export const getGames = (): Promise<Game[]> =>
  axios.get<Game[]>(BASE_URL).then(res => res.data);
