import axios from './axios';
import { User } from '../types/User';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const postLogin = (username: string, password: string) =>
  axios
    .post<User>(`${BASE_URL}/auth/login`, { username, password })
    .then(res => res.data);

export const postLogout = () =>
  axios.post<null>(`${BASE_URL}/auth/logout`).then(res => res.data);

export const getToken = () =>
  axios.get<User>(`${BASE_URL}/auth/token`).then(res => res.data);
