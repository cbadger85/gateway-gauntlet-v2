import {
  axiosSuccessInterceptor,
  axiosErrorInterceptor,
} from '../../controllers/axios';
import { tokenFailure } from '../../store/auth/authSlice';

jest.mock('../../store/auth/authSlice', () => ({
  tokenFailure: jest.fn(),
}));

jest.mock('../../store', () => ({
  dispatch: jest.fn(),
}));

describe('axios', () => {
  describe('axiosSuccessInterceptor', () => {
    it('should return the response', () => {
      const response = axiosSuccessInterceptor('response' as any);

      expect(response).toBe('response');
    });
  });

  describe('axiosErrorInterceptor', () => {
    it('should reject with the error passed into it', async () => {
      const error = await axiosErrorInterceptor(new Error() as any).catch(
        e => e,
      );

      expect(error).toBeInstanceOf(Error);
    });

    it('should call loginFailure', async () => {
      axiosErrorInterceptor(new Error() as any).catch(() => {
        expect(tokenFailure).toBeCalledWith();
      });
    });
  });
});
