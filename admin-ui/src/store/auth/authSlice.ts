import { createAction, createSlice } from '@reduxjs/toolkit';
import { AppThunk } from '..';
import { getToken, postLogin } from '../../controllers/authController';
import { Auth } from '../../types/Auth';
import { User } from '../../types/User';
import history from '../../utils/history';
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
    })
    .catch(e => {
      dispatch(loginFailure());
      dispatch(addSnackbar('Invalid Credentials', 'error'));
    });
};

export const logout = (): AppThunk => dispatch => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');

  dispatch(logoutSucess());
  history.push('/login');
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
