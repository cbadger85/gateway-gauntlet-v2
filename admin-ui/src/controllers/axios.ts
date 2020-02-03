import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import store from '../store';
import { tokenFailure } from '../store/auth/authSlice';

export const axiosSuccessRequestInterceptor = async (
  config: AxiosRequestConfig,
): Promise<AxiosRequestConfig> => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  config.headers = {
    'x-access-token': accessToken,
    'x-refresh-token': refreshToken,
  };

  return config;
};

axios.interceptors.request.use(axiosSuccessRequestInterceptor);

export const axiosSuccessResponseInterceptor = (
  response: AxiosResponse,
): AxiosResponse => {
  const accessToken = response.headers['x-access-token'];
  const refreshToken = response.headers['x-refresh-token'];

  accessToken && localStorage.setItem('accessToken', accessToken);
  refreshToken && localStorage.setItem('refreshToken', refreshToken);

  return response;
};

export const axiosErrorResponseInterceptor = (
  error: AxiosError,
): Promise<AxiosError> => {
  if (error.response?.status === 401) {
    store.dispatch(tokenFailure());
  }

  const accessToken = error.response?.headers['x-access-token'];
  const refreshToken = error.response?.headers['x-refresh-token'];

  accessToken && localStorage.setItem('accessToken', accessToken);
  refreshToken && localStorage.setItem('refreshToken', refreshToken);

  return Promise.reject(error);
};

axios.interceptors.response.use(
  axiosSuccessResponseInterceptor,
  axiosErrorResponseInterceptor,
);

export default axios;
