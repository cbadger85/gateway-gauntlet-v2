import { createSlice, createAction } from '@reduxjs/toolkit';
import { User } from '../user/userSlice';
import { AppThunk } from '..';
import axios from 'axios';

export enum AuthState {
  LOGGED_IN = 'LOGGED_IN',
  LOGGED_OUT = 'LOGGED_OUT',
  LOADING = 'LOADING',
}

export const loginSuccess = createAction<User>('auth/loginSuccess');
export const logoutSucess = createAction('auth/logoutSucess');

const authSlice = createSlice({
  name: 'auth',
  initialState: AuthState.LOGGED_OUT,
  reducers: {
    loading() {
      return AuthState.LOADING;
    },
    loginFailure() {
      return AuthState.LOGGED_OUT;
    },
  },
  extraReducers: {
    [loginSuccess.type]() {
      return AuthState.LOGGED_IN;
    },
    [logoutSucess.type]() {
      return AuthState.LOGGED_OUT;
    },
  },
});

const { loading, loginFailure } = authSlice.actions;

export default authSlice.reducer;

export const login = (
  username: string,
  password: string,
): AppThunk => dispatch => {
  dispatch(loading());

  axios
    .post<User>('/auth/login', { username, password })
    .then(res => {
      dispatch(loginSuccess(res.data));
    })
    .catch(e => {
      dispatch(loginFailure());
    });
};

export const logout = (): AppThunk => dispatch => {
  dispatch(logoutSucess());

  axios.post('/auth/logout');
};
