import {
  axiosSuccessInterceptor,
  axiosErrorInterceptor,
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
  describe('axiosSuccessInterceptor', () => {
    it('should return the response', () => {
      const response = axiosSuccessInterceptor('response' as any);

      expect(response).toBe('response');
    });
  });

  describe('axiosErrorInterceptor', () => {
    it('should reject with the error passed into it', async () => {
      const axiosError = new Error();
      //@ts-ignore
      axiosError.response = { status: 401 };

      const error = await axiosErrorInterceptor(
        new Error() as AxiosError,
      ).catch(e => e);

      expect(error).toBeInstanceOf(Error);
    });

    it('should call loginFailure if the status code is 401', async () => {
      const axiosError = new Error();
      //@ts-ignore
      axiosError.response = { status: 401 };

      await axiosErrorInterceptor(axiosError as AxiosError).catch(() => {
        expect(tokenFailure).toBeCalledWith();
      });
    });

    it('should not call loginFailure if the status code is not 401', async () => {
      const axiosError = new Error();
      //@ts-ignore
      axiosError.response = { status: 500 };

      await axiosErrorInterceptor(axiosError as AxiosError).catch(() => {
        expect(tokenFailure).not.toBeCalled();
      });
    });
  });
});
