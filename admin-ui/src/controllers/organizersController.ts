import axios from './axios';
import { Organizer } from '../types/Game';

const BASE_URL = `${process.env.REACT_APP_BASE_URL}/organizers`;

export const getOrganizers = (): Promise<Organizer[]> =>
  axios.get<Organizer[]>(BASE_URL).then(res => res.data);
