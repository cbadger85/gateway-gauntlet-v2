import { createAction, createSlice } from '@reduxjs/toolkit';
import { AppThunk } from '..';
import { User } from '../user/userSlice';
import {
  postLogout,
  postLogin,
  getToken,
} from '../../controllers/authController';
import history from '../../utils/history';

export enum AuthState {
  LOGGED_IN = 'LOGGED_IN',
  LOGGED_OUT = 'LOGGED_OUT',
  LOADING = 'LOADING',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
}

export const loginSuccess = createAction<User>('auth/loginSuccess');
export const logoutSucess = createAction('auth/logoutSuccess');

const authSlice = createSlice({
  name: 'auth',
  initialState: AuthState.LOGGED_OUT,
  reducers: {
    loading() {
      return AuthState.LOADING;
    },
    loginFailure() {
      return AuthState.LOGIN_FAILURE;
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

export const { loading, loginFailure } = authSlice.actions;

export default authSlice.reducer;

export const login = (
  username: string,
  password: string,
): AppThunk => dispatch => {
  dispatch(loading());

  postLogin(username, password)
    .then(user => {
      dispatch(loginSuccess(user));
    })
    .catch(e => {
      dispatch(loginFailure());
    });
};

export const logout = (): AppThunk => dispatch => {
  postLogout()
    .then(() => {
      history.push('/login');
      dispatch(logoutSucess());
    })
    .catch();
};

export const checkToken = (): AppThunk => dispatch => {
  dispatch(loading());

  getToken()
    .then(user => {
      dispatch(loginSuccess(user));
    })
    .catch(e => {
      history.push('/login');
      dispatch(loginFailure());
    });
};
