import axios from './axios';

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
