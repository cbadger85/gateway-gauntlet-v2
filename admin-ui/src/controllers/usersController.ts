import axios from './axios';
import { User } from '../types/User';
import { FieldData } from '../components/UpsertUserForm';

const BASE_URL = `${process.env.REACT_APP_BASE_URL}/users`;

export const postResetPassword = (
  userId: string,
  passwordResetId: string,
  password: string,
): Promise<void> =>
  axios
    .post<void>(`${BASE_URL}/${userId}/password/${passwordResetId}/reset`, {
      password,
    })
    .then(res => res.data);

export const getAllUsers = (): Promise<User[]> =>
  axios.get<User[]>(BASE_URL).then(res => res.data);

export const postUser = async (user: FieldData): Promise<User> =>
  axios.post<User>(BASE_URL, user).then(res => res.data);

export const putUser = async (userId: string, user: FieldData): Promise<User> =>
  axios.put<User>(`${BASE_URL}/${userId}`, user).then(res => res.data);

export const postDisableUser = async (userId: string): Promise<void> =>
  axios.post<void>(`${BASE_URL}/${userId}/disable`).then(res => res.data);

export const postEnableUser = async (userId: string): Promise<void> =>
  axios.post<void>(`${BASE_URL}/${userId}/enable`).then(res => res.data);
