import { createAction, createSlice } from '@reduxjs/toolkit';
import { AppThunk } from '..';
import {
  postLogout,
  postLogin,
  getToken,
} from '../../controllers/authController';
import history from '../../utils/history';
import { User } from '../../types/User';
import { Auth } from '../../types/Auth';
import { addSnackbar } from '../alert/alertSlice';

export const loginSuccess = createAction<User>('auth/loginSuccess');
export const logoutSucess = createAction('auth/logoutSuccess');

const authSlice = createSlice({
  name: 'auth',
  initialState: Auth.LOGGED_OUT,
  reducers: {
    loading() {
      return Auth.LOADING;
    },
    tokenFailure() {
      return Auth.TOKEN_FAILURE;
    },
    loginFailure() {
      return Auth.LOGIN_FAILURE;
    },
  },
  extraReducers: {
    [loginSuccess.type]() {
      return Auth.LOGGED_IN;
    },
    [logoutSucess.type]() {
      return Auth.LOGGED_OUT;
    },
  },
});

export const { loading, tokenFailure, loginFailure } = authSlice.actions;

export default authSlice.reducer;

export const login = (
  username: string,
  password: string,
): AppThunk => dispatch => {
  dispatch(loading());

  postLogin(username, password)
    .then(user => {
      dispatch(loginSuccess(user));
      dispatch(addSnackbar('Welcome!'));
    })
    .catch(e => {
      dispatch(loginFailure());
      dispatch(addSnackbar('Invalid Credentials', 'error'));
    });
};

export const logout = (): AppThunk => dispatch => {
  postLogout()
    .then(() => {
      history.push('/login');
      dispatch(logoutSucess());
    })
    .catch(e => null);
};

export const checkToken = (): AppThunk => dispatch => {
  dispatch(loading());

  getToken()
    .then(user => {
      dispatch(loginSuccess(user));
    })
    .catch(e => {
      history.push('/login');
      dispatch(tokenFailure());
    });
};
