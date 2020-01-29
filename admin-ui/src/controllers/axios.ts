import axios, { AxiosError } from 'axios';
import store from '../store';
import { loginFailure } from '../store/auth/authSlice';

axios.interceptors.response.use(
  response => {
    return response;
  },
  (error: AxiosError) => {
    store.dispatch(loginFailure());

    return Promise.reject(error);
  },
);

export default axios;
