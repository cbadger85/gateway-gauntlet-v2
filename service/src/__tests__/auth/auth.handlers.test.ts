import { Role } from '../../auth/models/Role';
import Container from 'typedi';
import AuthService from '../../auth/auth.service';
import {
  login,
  logout,
  verifyAuthorization,
  requestResetPassword,
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
    it('should call res.cookie twice for each cookie created', async () => {
      authService.login.mockReturnValue({
        user: mockUser,
        accessToken: 'access token',
        refreshToken: 'refresh token',
      });

      await login({} as any, mockRes as any, jest.fn());

      const cookieOptions = {
        expires: expect.any(Date),
        httpOnly: true,
      };

      expect(mockRes.cookie).toHaveBeenNthCalledWith(
        1,
        'access-token',
        'access token',
        cookieOptions,
      );
      expect(mockRes.cookie).toHaveBeenNthCalledWith(
        2,
        'refresh-token',
        'refresh token',
        cookieOptions,
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

  describe('logout', () => {
    it('should call res.clearCookie twice', () => {
      logout({} as any, mockRes as any, jest.fn());

      expect(mockRes.clearCookie).toHaveBeenNthCalledWith(1, 'access-token');
      expect(mockRes.clearCookie).toHaveBeenNthCalledWith(2, 'refresh-token');
    });

    it('should call res.sendStatus', () => {
      logout({} as any, mockRes as any, jest.fn());

      expect(mockRes.sendStatus).toHaveBeenCalledWith(204);
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

  describe('verify authorization', () => {
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
        cookies: {
          'access-token': 'old access token',
          'refresh-token': 'old refresh token',
        },
      };

      await verifyAuthorization(mockReq as any, mockRes as any, jest.fn());

      expect(authService.refresh).toBeCalledWith(
        mockReq.cookies['access-token'],
        mockReq.cookies['refresh-token'],
      );
    });

    it('should call res.cookie twice for each cookie created', async () => {
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
        cookies: {
          'access-token': 'old access token',
          'refresh-token': 'old refresh token',
        },
      };

      await verifyAuthorization(mockReq as any, mockRes as any, jest.fn());

      const cookieOptions = {
        expires: expect.any(Date),
        httpOnly: true,
      };

      expect(mockRes.cookie).toHaveBeenNthCalledWith(
        1,
        'access-token',
        'access token',
        cookieOptions,
      );
      expect(mockRes.cookie).toHaveBeenNthCalledWith(
        2,
        'refresh-token',
        'refresh token',
        cookieOptions,
      );
    });

    it('should add the user to the request object', async () => {
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
        cookies: {
          'access-token': 'old access token',
          'refresh-token': 'old refresh token',
        },
        user: undefined,
      };

      const next = jest.fn();
      await verifyAuthorization(mockReq as any, mockRes as any, next);

      expect(mockReq.user).toEqual(userAuth);
    });

    it('should call next', async () => {
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
        cookies: {
          'access-token': 'old access token',
          'refresh-token': 'old refresh token',
        },
      };

      const next = jest.fn();
      await verifyAuthorization(mockReq as any, mockRes as any, next);

      expect(next).toBeCalledWith();
    });
  });
});
