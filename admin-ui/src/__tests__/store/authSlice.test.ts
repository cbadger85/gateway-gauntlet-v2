import authReducer, {
  AuthState,
  loading,
  loginFailure,
  loginSuccess,
  logoutSucess,
  login,
  logout,
  checkToken,
} from '../../store/auth/authSlice';
import { getDefaultMiddleware } from '@reduxjs/toolkit';
import configureStore from 'redux-mock-store';
import {
  postLogin,
  postLogout,
  getToken,
} from '../../controllers/authController';
import history from '../../utils/history';

jest.mock('../../store');

jest.mock('../../controllers/authController.ts', () => ({
  postLogin: jest.fn(),
  postLogout: jest.fn(),
  getToken: jest.fn(),
}));

jest.mock('../../utils/history', () => ({
  push: jest.fn(),
}));

const mockStore = configureStore([...getDefaultMiddleware()]);

describe('authSlice', () => {
  describe('authReducer', () => {
    it('should set state to LOGGED_IN when logged in', () => {
      const authState = authReducer(undefined, {
        type: loginSuccess.type,
      });

      expect(authState).toBe(AuthState.LOGGED_IN);
    });

    it('should set state to LOGGED_OUT when logged out', () => {
      const authState = authReducer(undefined, {
        type: logoutSucess.type,
      });

      expect(authState).toBe(AuthState.LOGGED_OUT);
    });

    it('should set state to LOADING when logged state has not been determined', () => {
      const authState = authReducer(undefined, {
        type: loading.type,
      });

      expect(authState).toBe(AuthState.LOADING);
    });

    it('should set state to LOGIN_FAILURE when logging in has failed', () => {
      const authState = authReducer(undefined, {
        type: loginFailure.type,
      });

      expect(authState).toBe(AuthState.LOGIN_FAILURE);
    });
  });

  describe('login', () => {
    it('should dispatch the loading and the loginSuccess action if login successful', async () => {
      (postLogin as jest.Mock).mockResolvedValue('user');
      const username = 'foobar';
      const password = 'password';

      const loadingAction = { type: loading.type };
      const loginAction = { type: loginSuccess.type, payload: 'user' };

      const store = mockStore({ auth: undefined });
      await store.dispatch(login(username, password) as any);

      expect(store.getActions()).toEqual([loadingAction, loginAction]);
    });

    it('should dispatch the loading and the loginFailure action if login failed', async () => {
      (postLogin as jest.Mock).mockRejectedValue(new Error());
      const username = 'foobar';
      const password = 'password';

      const loadingAction = { type: loading.type };
      const loginAction = { type: loginFailure.type };

      const store = mockStore({ auth: undefined });
      try {
        await store.dispatch(login(username, password) as any);
      } catch {
        expect(store.getActions()).toEqual([loadingAction, loginAction]);
      }
    });

    it('should call postLogin with the username and password', async () => {
      (postLogin as jest.Mock).mockResolvedValue('user');
      const username = 'foobar';
      const password = 'password';

      const store = mockStore({ auth: undefined });
      await store.dispatch(login(username, password) as any);

      expect(postLogin).toBeCalledWith(username, password);
    });
  });

  describe('logout', () => {
    it('should dispatch the logout success action', async () => {
      (postLogout as jest.Mock).mockResolvedValue(undefined);

      const logoutAction = { type: logoutSucess.type };

      const store = mockStore({ auth: undefined });
      await store.dispatch(logout() as any);

      expect(store.getActions()).toEqual([logoutAction]);
    });

    it('should dispatch no action if the logout fails', async () => {
      (postLogout as jest.Mock).mockRejectedValue(new Error());

      const store = mockStore({ auth: undefined });
      try {
        await store.dispatch(logout() as any);
      } catch {
        expect(store.getActions()).toEqual([]);
      }
    });

    it(`should call history.push with '/login'`, async () => {
      (postLogout as jest.Mock).mockResolvedValue(undefined);

      const store = mockStore({ auth: undefined });
      await store.dispatch(logout() as any);

      expect(history.push).toBeCalledWith('/login');
    });

    it(`should call postLogout`, async () => {
      (postLogout as jest.Mock).mockResolvedValue(undefined);

      const store = mockStore({ auth: undefined });
      await store.dispatch(logout() as any);

      expect(postLogout).toBeCalledWith();
    });
  });

  describe('checkToken', () => {
    it('should dispatch the loading and loginSuccess action if the token is valid', async () => {
      (getToken as jest.Mock).mockResolvedValue('user');

      const loadingAction = { type: loading.type };
      const loginAction = { type: loginSuccess.type, payload: 'user' };

      const store = mockStore({ auth: undefined });
      await store.dispatch(checkToken() as any);

      expect(store.getActions()).toEqual([loadingAction, loginAction]);
    });

    it('should dispatch the loading and loginFailure action if the token is not valid', async () => {
      (getToken as jest.Mock).mockRejectedValue(new Error());

      const loadingAction = { type: loading.type };
      const loginAction = { type: loginFailure.type };

      const store = mockStore({ auth: undefined });
      try {
        await store.dispatch(checkToken() as any);
      } catch {
        expect(store.getActions()).toEqual([loadingAction, loginAction]);
      }
    });

    it(`should call history.push with '/login'`, async () => {
      (getToken as jest.Mock).mockResolvedValue('user');

      const store = mockStore({ auth: undefined });
      await store.dispatch(checkToken() as any);

      expect(history.push).toBeCalledWith('/login');
    });

    it(`should call getToken`, async () => {
      (getToken as jest.Mock).mockResolvedValue(undefined);

      const store = mockStore({ auth: undefined });
      await store.dispatch(checkToken() as any);

      expect(getToken).toBeCalledWith();
    });
  });
});
