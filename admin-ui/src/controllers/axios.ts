import axios, { AxiosError, AxiosResponse } from 'axios';
import store from '../store';
import { tokenFailure } from '../store/auth/authSlice';

export const axiosSuccessInterceptor = (
  response: AxiosResponse,
): AxiosResponse => response;

export const axiosErrorInterceptor = (
  error: AxiosError,
): Promise<AxiosError> => {
  if (error.response?.status === 401) {
    store.dispatch(tokenFailure());
  }

  return Promise.reject(error);
};

axios.interceptors.response.use(axiosSuccessInterceptor, axiosErrorInterceptor);

export default axios;
