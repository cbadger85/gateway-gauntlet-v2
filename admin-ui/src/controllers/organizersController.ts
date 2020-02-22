import axios from './axios';

const BASE_URL = `${process.env.REACT_APP_BASE_URL}/organizers`;

export const getOrganizers = (): Promise<{ id: string; name: string }[]> =>
  axios.get<{ id: string; name: string }[]>(BASE_URL).then(res => res.data);
