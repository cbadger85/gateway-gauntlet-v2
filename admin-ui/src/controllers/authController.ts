import axios from './axios';
import { User } from '../types/User';

const BASE_URL = `${process.env.REACT_APP_BASE_URL}/auth`;

export const postLogin = (username: string, password: string): Promise<User> =>
  axios
    .post<User>(`${BASE_URL}/login`, { username, password })
    .then(res => res.data);

export const postLogout = (): Promise<void> =>
  axios.post<void>(`${BASE_URL}/logout`).then(res => res.data);

export const getToken = (): Promise<User> =>
  axios.get<User>(`${BASE_URL}/token`).then(res => res.data);

export const postRequestResetPassword = (email: string): Promise<void> =>
  axios
    .post<void>(`${BASE_URL}/password/reset`, { email })
    .then(res => res.data);
