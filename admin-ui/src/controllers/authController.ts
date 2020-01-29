import axios from './axios';
import { User } from '../store/user/userSlice';

export const postLogin = (username: string, password: string) =>
  axios
    .post<User>('/api/auth/login', { username, password })
    .then(res => res.data);

export const postLogout = () =>
  axios.post<null>('/api/auth/logout').then(res => res.data);

export const getToken = () =>
  axios.get<User>('/api/auth/token').then(res => res.data);
