import {
  axiosSuccessResponseInterceptor,
  axiosErrorResponseInterceptor,
  axiosSuccessRequestInterceptor,
} from '../../controllers/axios';
import { tokenFailure } from '../../store/auth/authSlice';
import { AxiosError } from 'axios';

jest.mock('../../store/auth/authSlice', () => ({
  tokenFailure: jest.fn(),
}));

jest.mock('../../store', () => ({
  dispatch: jest.fn(),
}));

beforeEach(jest.clearAllMocks);

describe('axios', () => {
  describe('axiosSuccessRequestInterceptor', () => {
    it('should get the tokens from local storage and put then in the header', async () => {
      (localStorage.getItem as jest.Mock).mockReturnValueOnce('access token');
      (localStorage.getItem as jest.Mock).mockReturnValueOnce('refresh token');

      const config = {
        headers: {},
      };

      const newConfig = await axiosSuccessRequestInterceptor(config);

      expect(newConfig.headers['x-access-token']).toBe('access token');
      expect(newConfig.headers['x-refresh-token']).toBe('refresh token');
    });
  });

  describe('axiosSuccessInterceptor', () => {
    it('should return the response', () => {
      const axiosResponse = {
        headers: {
          'x-access-token': 'access token',
          'x-refresh-token': 'refresh token',
        },
      };

      const response = axiosSuccessResponseInterceptor(axiosResponse as any);

      expect(response).toBe(response);
    });

    it('should put the tokens in local storage if they exist', () => {
      const axiosResponse = {
        headers: {
          'x-access-token': 'access token',
          'x-refresh-token': 'refresh token',
        },
      };

      axiosSuccessResponseInterceptor(axiosResponse as any);

      expect(localStorage.setItem).toHaveBeenNthCalledWith(
        1,
        'accessToken',
        'access token',
      );
      expect(localStorage.setItem).toHaveBeenNthCalledWith(
        2,
        'refreshToken',
        'refresh token',
      );
    });

    it('should not try to put the tokens in local storage if they don`t exist', () => {
      const axiosResponse = {
        headers: {},
      };

      axiosSuccessResponseInterceptor(axiosResponse as any);

      expect(localStorage.setItem).not.toBeCalled();
    });
  });

  describe('axiosErrorInterceptor', () => {
    it('should reject with the error passed into it', async () => {
      const axiosError = new Error();
      //@ts-ignore
      axiosError.response = { status: 401, headers: {} };

      const error = await axiosErrorResponseInterceptor(
        new Error() as AxiosError,
      ).catch(e => e);

      expect(error).toBeInstanceOf(Error);
    });

    it('should call loginFailure if the status code is 401', async () => {
      const axiosError = new Error();
      //@ts-ignore
      axiosError.response = { status: 401, headers: {} };

      await axiosErrorResponseInterceptor(axiosError as AxiosError).catch(
        () => {
          expect(tokenFailure).toBeCalledWith();
        },
      );
    });

    it('should put the tokens in local storage if they exist', async () => {
      const axiosError = new Error();
      //@ts-ignore
      axiosError.response = {
        status: 500,
        headers: {
          'x-access-token': 'access token',
          'x-refresh-token': 'refresh token',
        },
      };

      await axiosErrorResponseInterceptor(axiosError as AxiosError).catch(
        () => {
          expect(localStorage.setItem).toHaveBeenNthCalledWith(
            1,
            'accessToken',
            'access token',
          );
          expect(localStorage.setItem).toHaveBeenNthCalledWith(
            2,
            'refreshToken',
            'refresh token',
          );
        },
      );
    });

    it('should not try to put the tokens in local storage if they dont`t exist', async () => {
      const axiosError = new Error();
      //@ts-ignore
      axiosError.response = {
        status: 500,
        headers: {},
      };

      await axiosErrorResponseInterceptor(axiosError as AxiosError).catch(
        () => {
          expect(localStorage.setItem).not.toBeCalled();
        },
      );
    });

    it('should not call loginFailure if the status code is not 401', async () => {
      const axiosError = new Error();
      //@ts-ignore
      axiosError.response = { status: 500, headers: {} };

      await axiosErrorResponseInterceptor(axiosError as AxiosError).catch(
        () => {
          expect(tokenFailure).not.toBeCalled();
        },
      );
    });
  });
});
