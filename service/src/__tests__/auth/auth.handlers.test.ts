import { Role } from '../../auth/Role.model';
import Container from 'typedi';
import AuthService from '../../auth/auth.service';
import {
  login,
  authenticateUser,
  requestResetPassword,
  getToken,
} from '../../auth/auth.handlers';

const mockUser = {
  id: '1234',
  username: 'foo',
  email: 'foo@example.com',
  roles: [Role.USER],
};

const mockRes = {
  json: jest.fn(),
  cookie: jest.fn(),
  clearCookie: jest.fn(),
  sendStatus: jest.fn(),
  setHeader: jest.fn(),
};

class MockService {
  login = jest.fn();
  refresh = jest.fn();
  requestResetPassword = jest.fn();
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('auth.handlers', () => {
  let authService: MockService;

  beforeAll(() => {
    Container.set(AuthService, new MockService());
    authService = (Container.get(AuthService) as unknown) as MockService;
  });

  describe('login', () => {
    it('should call res.setHeader for each token', async () => {
      authService.login.mockReturnValue({
        user: mockUser,
        accessToken: 'access token',
        refreshToken: 'refresh token',
      });

      await login({} as any, mockRes as any, jest.fn());

      expect(mockRes.setHeader).toHaveBeenNthCalledWith(
        1,
        'x-access-token',
        'access token',
      );
      expect(mockRes.setHeader).toHaveBeenNthCalledWith(
        2,
        'x-refresh-token',
        'refresh token',
      );
    });

    it('should call res.json with the user', async () => {
      authService.login.mockReturnValue({
        user: mockUser,
        accessToken: 'access token',
        refreshToken: 'refresh token',
      });

      await login({} as any, mockRes as any, jest.fn());

      expect(mockRes.json).toBeCalledWith(mockUser);
    });
  });

  describe('requestResetPassword', () => {
    it('should call userService.requestResetPassword with the email', async () => {
      const mockReq = {
        body: { email: 'foo@example.com' },
      };

      await requestResetPassword(mockReq as any, mockRes as any, jest.fn());

      expect(authService.requestResetPassword).toBeCalledWith(
        mockReq.body.email,
      );
    });

    it('should call res.sendStatus with 204', async () => {
      const mockReq = {
        body: { email: 'foo@example.com' },
      };

      await requestResetPassword(mockReq as any, mockRes as any, jest.fn());

      expect(mockRes.sendStatus).toBeCalledWith(204);
    });
  });

  describe('authenticateUser', () => {
    it('should call authService.refresh with the old access token and old refresh token', async () => {
      const userAuth = {
        id: '1234',
        sessionId: '5678',
        roles: [Role.USER],
      };

      authService.refresh.mockReturnValue({
        userAuth,
        accessToken: 'access token',
        refreshToken: 'refresh token',
      });

      const mockReq = {
        headers: {
          'x-access-token': 'old access token',
          'x-refresh-token': 'old refresh token',
        },
      };

      await authenticateUser(mockReq as any, mockRes as any, jest.fn());

      expect(authService.refresh).toBeCalledWith(
        mockReq.headers['x-access-token'],
        mockReq.headers['x-refresh-token'],
      );
    });

    it('should call res.setHeader for each token', async () => {
      const userAuth = {
        id: '1234',
        sessionId: '5678',
        roles: [Role.USER],
      };

      authService.refresh.mockReturnValue({
        userAuth,
        accessToken: 'access token',
        refreshToken: 'refresh token',
      });

      const mockReq = {
        headers: {
          'x-access-token': 'old access token',
          'x-refresh-token': 'old refresh token',
        },
      };

      await authenticateUser(mockReq as any, mockRes as any, jest.fn());

      expect(mockRes.setHeader).toHaveBeenNthCalledWith(
        1,
        'x-access-token',
        'access token',
      );
      expect(mockRes.setHeader).toHaveBeenNthCalledWith(
        2,
        'x-refresh-token',
        'refresh token',
      );
    });

    it('should add the user to the request object', async () => {
      const user = {
        id: '1234',
        sessionId: '5678',
        roles: [Role.USER],
      };

      authService.refresh.mockReturnValue({
        user,
        accessToken: 'access token',
        refreshToken: 'refresh token',
      });

      const mockReq = {
        headers: {
          'x-access-token': 'old access token',
          'x-refresh-token': 'old refresh token',
        },
        user: undefined,
      };

      const next = jest.fn();
      await authenticateUser(mockReq as any, mockRes as any, next);

      expect(mockReq.user).toEqual(user);
    });

    it('should call next', async () => {
      const user = {
        id: '1234',
        sessionId: '5678',
        roles: [Role.USER],
      };

      authService.refresh.mockReturnValue({
        user,
        accessToken: 'access token',
        refreshToken: 'refresh token',
      });

      const mockReq = {
        headers: {
          'x-access-token': 'old access token',
          'x-refresh-token': 'old refresh token',
        },
      };

      const next = jest.fn();
      await authenticateUser(mockReq as any, mockRes as any, next);

      expect(next).toBeCalledWith();
    });
  });

  describe('getToken', () => {
    it('should call res.json with the user', () => {
      const mockReq = {
        user: mockUser,
      };

      getToken(mockReq as any, mockRes as any, jest.fn());

      expect(mockRes.json).toBeCalledWith(mockUser);
    });
  });
});
