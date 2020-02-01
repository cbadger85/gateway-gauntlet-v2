import axios, { AxiosError, AxiosResponse } from 'axios';
import store from '../store';
import { loginFailure } from '../store/auth/authSlice';

export const axiosSuccessInterceptor = (response: AxiosResponse) => response;

export const axiosErrorInterceptor = (error: AxiosError) => {
  store.dispatch(loginFailure());

  return Promise.reject(error);
};

axios.interceptors.response.use(axiosSuccessInterceptor, axiosErrorInterceptor);

export default axios;
