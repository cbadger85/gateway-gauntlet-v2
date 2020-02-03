import axios from '../../controllers/axios';
import {
  postLogin,
  getToken,
  postRequestResetPassword,
} from '../../controllers/authController';

jest.mock('../../controllers/axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

beforeEach(jest.clearAllMocks);

describe('authController', () => {
  describe('postLogin', () => {
    it('should call axios with the url, username and password', async () => {
      (axios.post as jest.Mock).mockResolvedValue({ data: 'user' });

      const username = 'foo';
      const password = 'bar';
      await postLogin(username, password);

      const url = `${process.env.REACT_APP_BASE_URL}/auth/login`;

      expect(axios.post).toBeCalledWith(url, { username, password });
    });

    it('should return a user', async () => {
      (axios.post as jest.Mock).mockResolvedValue({ data: 'user' });

      const username = 'foo';
      const password = 'bar';
      const user = await postLogin(username, password);

      expect(user).toBe('user');
    });
  });

  describe('getToken', () => {
    it('should call axios with the url, username and password', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: 'user' });

      await getToken();

      const url = `${process.env.REACT_APP_BASE_URL}/auth/token`;

      expect(axios.get).toBeCalledWith(url);
    });

    it('should return a user', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: 'user' });

      const data = await getToken();

      expect(data).toBe('user');
    });
  });

  describe('postRequestResetPassword', () => {
    it('should call axios with the url and email', async () => {
      (axios.post as jest.Mock).mockResolvedValue({ data: undefined });
      const email = 'email@example.com';

      await postRequestResetPassword(email);

      const url = `${process.env.REACT_APP_BASE_URL}/auth/password/reset`;

      expect(axios.post).toBeCalledWith(url, { email });
    });

    it('should return nothing', async () => {
      (axios.post as jest.Mock).mockResolvedValue({ data: undefined });
      const email = 'email@example.com';

      const data = await postRequestResetPassword(email);

      expect(data).toBeUndefined();
    });
  });
});
