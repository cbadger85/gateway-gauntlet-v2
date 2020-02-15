import axios from '../../controllers/axios';
import {
  postResetPassword,
  getAllUsers,
  postUser,
  putUser,
  postDisableUser,
  postEnableUser,
  putChangePassword,
} from '../../controllers/usersController';
import { Role } from '../../types/User';

jest.mock('../../controllers/axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
}));

beforeEach(jest.clearAllMocks);

describe('userController', () => {
  describe('getAllUsers', () => {
    it('should call axios with the url and password', async () => {
      (axios.post as jest.Mock).mockResolvedValue({ data: undefined });

      const userId = 'aaa';
      const passwordResetId = 'bbb';
      const password = 'bar';
      await postResetPassword(userId, passwordResetId, password);

      const url = `${process.env.REACT_APP_BASE_URL}/users/${userId}/password/${passwordResetId}/reset`;

      expect(axios.post).toBeCalledWith(url, { password });
    });
  });

  describe('getAllUsers', () => {
    it('should call axios with the url', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: 'users' });

      await getAllUsers();

      const url = `${process.env.REACT_APP_BASE_URL}/users`;

      expect(axios.get).toBeCalledWith(url);
    });
  });

  describe('postUser', () => {
    it('should call axios with the url and user', async () => {
      (axios.post as jest.Mock).mockResolvedValue({ data: 'user' });

      const user = {
        username: 'foobar',
        firstName: 'foo',
        lastName: 'bar',
        email: 'foo@email.com',
        roles: [Role.USER],
      };

      await postUser(user);

      const url = `${process.env.REACT_APP_BASE_URL}/users`;

      expect(axios.post).toBeCalledWith(url, user);
    });
  });

  describe('putUser', () => {
    it('should call axios with the url and user', async () => {
      (axios.put as jest.Mock).mockResolvedValue({ data: 'user' });

      const user = {
        username: 'foobar',
        firstName: 'foo',
        lastName: 'bar',
        email: 'foo@email.com',
        roles: [Role.USER],
      };

      await putUser('1', user);

      const url = `${process.env.REACT_APP_BASE_URL}/users/1`;

      expect(axios.put).toBeCalledWith(url, user);
    });
  });

  describe('postDisableUser', () => {
    it('should call axios with the url and user', async () => {
      (axios.post as jest.Mock).mockResolvedValue({ data: 'user' });

      await postDisableUser('1');

      const url = `${process.env.REACT_APP_BASE_URL}/users/1/disable`;

      expect(axios.post).toBeCalledWith(url);
    });
  });

  describe('postEnableUser', () => {
    it('should call axios with the url and user', async () => {
      (axios.post as jest.Mock).mockResolvedValue({ data: 'user' });

      await postEnableUser('1');

      const url = `${process.env.REACT_APP_BASE_URL}/users/1/enable`;

      expect(axios.post).toBeCalledWith(url);
    });
  });

  describe('putChangePassword', () => {
    it('should call axios with the url and password', async () => {
      (axios.post as jest.Mock).mockResolvedValue({ data: undefined });

      const userId = 'aaa';
      const password = 'bar';
      await putChangePassword(userId, password);

      const url = `${process.env.REACT_APP_BASE_URL}/users/${userId}/password`;

      expect(axios.put).toBeCalledWith(url, { password });
    });
  });
});
