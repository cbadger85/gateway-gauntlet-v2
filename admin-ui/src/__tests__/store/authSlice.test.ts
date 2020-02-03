import { getDefaultMiddleware } from '@reduxjs/toolkit';
import configureStore from 'redux-mock-store';
import { getToken, postLogin } from '../../controllers/authController';
import { addSnackbar } from '../../store/alert/alertSlice';
import authReducer, {
  checkToken,
  loading,
  login,
  loginFailure,
  loginSuccess,
  logout,
  logoutSucess,
  tokenFailure,
} from '../../store/auth/authSlice';
import { Auth } from '../../types/Auth';
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

jest.mock('shortid', () => jest.fn().mockReturnValue('1234'));

const mockStore = configureStore([...getDefaultMiddleware()]);

describe('authSlice', () => {
  describe('authReducer', () => {
    it('should set state to LOGGED_IN when logged in', () => {
      const auth = authReducer(undefined, {
        type: loginSuccess.type,
      });

      expect(auth).toBe(Auth.LOGGED_IN);
    });

    it('should set state to LOGGED_OUT when logged out', () => {
      const auth = authReducer(undefined, {
        type: logoutSucess.type,
      });

      expect(auth).toBe(Auth.LOGGED_OUT);
    });

    it('should set state to LOADING when logged state has not been determined', () => {
      const auth = authReducer(undefined, {
        type: loading.type,
      });

      expect(auth).toBe(Auth.LOADING);
    });

    it('should set state to TOKEN_FAILURE when logging in has failed', () => {
      const auth = authReducer(undefined, {
        type: tokenFailure.type,
      });

      expect(auth).toBe(Auth.TOKEN_FAILURE);
    });

    it('should set state to LOGIN_FAILURE when logging in has failed', () => {
      const auth = authReducer(undefined, {
        type: loginFailure.type,
      });

      expect(auth).toBe(Auth.LOGIN_FAILURE);
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

    it('should dispatch the loading, loginFailure, and addSnackbar action if login failed', async () => {
      expect.assertions(1);
      (postLogin as jest.Mock).mockRejectedValue(new Error());
      const username = 'foobar';
      const password = 'password';

      const loadingAction = { type: loading.type };
      const loginAction = { type: loginFailure.type };
      const snackBar = {
        type: addSnackbar.type,
        payload: {
          id: '1234',
          message: 'Invalid Credentials',
          severity: 'error',
        },
      };

      const store = mockStore({ auth: undefined });

      await store.dispatch((async (dispatch: any) => {
        dispatch(login(username, password) as any);
      }) as any);

      expect(store.getActions()).toEqual([
        loadingAction,
        loginAction,
        snackBar,
      ]);
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
    it('should remove the tokens from local storage', () => {
      const store = mockStore({ auth: undefined });
      store.dispatch(logout() as any);

      expect(localStorage.removeItem).toHaveBeenNthCalledWith(1, 'accessToken');
      expect(localStorage.removeItem).toHaveBeenNthCalledWith(
        2,
        'refreshToken',
      );
    });

    it('should dispatch the logout success action', () => {
      const logoutAction = { type: logoutSucess.type };

      const store = mockStore({ auth: undefined });
      store.dispatch(logout() as any);

      expect(store.getActions()).toEqual([logoutAction]);
    });

    it(`should call history.push with '/login'`, () => {
      const store = mockStore({ auth: undefined });
      store.dispatch(logout() as any);

      expect(history.push).toBeCalledWith('/login');
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
      const loginAction = { type: tokenFailure.type };

      const store = mockStore({ auth: undefined });

      await store.dispatch((async (dispatch: any) => {
        dispatch(checkToken() as any);
      }) as any);

      expect(store.getActions()).toEqual([loadingAction, loginAction]);
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
