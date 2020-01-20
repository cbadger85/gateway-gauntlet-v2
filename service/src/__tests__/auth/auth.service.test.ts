import AuthService from '../../auth/auth.service';
import Container from 'typedi';
import bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import User from '../../users/entities/users.entity';
import UserRepository from '../../users/users.repository';
import { Role } from '../../auth/models/Role';
import NotAuthorized from '../../errors/NotAuthorized';
import jwt from 'jsonwebtoken';

const mockLoginRequest = {
  username: 'foo',
  password: 'bar',
};

const mockUser = new User();

mockUser.id = '1';
mockUser.username = 'foo';
mockUser.password = 'bar';
mockUser.sessionId = '1234';
mockUser.roles = [Role.USER];

class MockRepository {
  private repository: Repository<User>;
  saveUser = jest.fn();
  findUser = jest.fn();
  findUserByUsername = jest.fn();
}

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

beforeEach(jest.clearAllMocks);

describe('AuthService', () => {
  let authService: AuthService;
  const mockRepository = new MockRepository();

  beforeAll(() => {
    Container.set(
      AuthService,
      new AuthService((mockRepository as unknown) as UserRepository),
    );
    authService = Container.get(AuthService);
  });

  describe('login', () => {
    it('should return the user if login is valid', async () => {
      mockRepository.findUserByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const user = await authService.login(mockLoginRequest);

      const expectedUser = {
        id: '1',
        username: 'foo',
        roles: [Role.USER],
      };

      expect(mockRepository.findUserByUsername).toBeCalledWith('foo');
      expect(bcrypt.compare).toBeCalledWith('bar', 'bar');
      expect(user).toEqual(expectedUser);
    });

    it('should throw NotAuthorized if the user cannot be found', async () => {
      mockRepository.findUserByUsername.mockResolvedValue(undefined);

      const error = await authService.login(mockLoginRequest).catch(e => e);

      expect(mockRepository.findUserByUsername).toBeCalledWith('foo');
      expect(error).toBeInstanceOf(NotAuthorized);
      expect(bcrypt.compare).not.toBeCalled();
    });

    it('should throw NotAuthorized if there is no sessionId', async () => {
      const mockUser = new User();

      mockUser.id = '1';
      mockUser.username = 'foo';
      mockUser.password = 'bar';
      mockUser.roles = [Role.USER];
      mockRepository.findUserByUsername.mockResolvedValue(mockUser);

      const error = await authService.login(mockLoginRequest).catch(e => e);

      expect(mockRepository.findUserByUsername).toBeCalledWith('foo');
      expect(error).toBeInstanceOf(NotAuthorized);
      expect(bcrypt.compare).not.toBeCalled();
    });

    it('should throw NotAuthorized if the password is incorrect', async () => {
      mockRepository.findUserByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const mockLoginRequest = {
        username: 'foo',
        password: 'baz',
      };

      const error = await authService.login(mockLoginRequest).catch(e => e);

      expect(mockRepository.findUserByUsername).toBeCalledWith('foo');
      expect(bcrypt.compare).toBeCalledWith('baz', 'bar');
      expect(error).toBeInstanceOf(NotAuthorized);
    });
  });

  describe('getAccessToken', () => {
    it('should call jwt.sign', () => {
      const payload = { id: '123', roles: [Role.USER] };

      const jwtOptions = { expiresIn: '10m' };

      authService.getAccessToken(payload);

      expect(jwt.sign).toBeCalledWith(payload, 'SHH', jwtOptions);
    });
  });

  describe('getRefreshToken', () => {
    it('should call jwt.sign', () => {
      const payload = { id: '123', sessionId: '1234' };

      const jwtOptions = { expiresIn: '24h' };

      authService.getRefreshToken(payload);

      expect(jwt.sign).toBeCalledWith(payload, 'SHHH', jwtOptions);
    });
  });

  describe('parseAccessToken', () => {
    it('should return a payload if verify is successful', () => {
      (jwt.verify as jest.Mock).mockReturnValue('payload');

      const token = 'token';

      const payload = authService.parseAccessToken(token);

      expect(jwt.verify).toBeCalledWith(token, 'SHH');
      expect(payload).toBe('payload');
    });

    it('should throw not authorized if verify fails', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error();
      });

      const token = 'token';

      expect(() => authService.parseAccessToken(token)).toThrowError(
        NotAuthorized,
      );
    });
  });

  describe('parseRefreshToken', () => {
    it('should return a payload if verify is successful', () => {
      (jwt.verify as jest.Mock).mockReturnValue('payload');

      const token = 'token';

      const payload = authService.parseRefreshToken(token);

      expect(jwt.verify).toBeCalledWith(token, 'SHHH');
      expect(payload).toBe('payload');
    });

    it('should throw not authorized if verify fails', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error();
      });

      const token = 'token';

      expect(() => authService.parseRefreshToken(token)).toThrowError(
        NotAuthorized,
      );
    });
  });

  describe('refresh', () => {
    it('should return an access token, refresh token, and UserAuth object', async () => {
      const oldAccessToken = 'old access token';
      const oldRefreshToken = 'old refresh token';

      const accessTokenPayload = { id: '1234', roles: [Role.USER] };
      const refreshTokenPayload = { id: '1234', sessionId: '5678' };

      (jwt.verify as jest.Mock)
        .mockReturnValueOnce(accessTokenPayload)
        .mockReturnValueOnce(refreshTokenPayload);

      (jwt.sign as jest.Mock)
        .mockReturnValueOnce('access token')
        .mockReturnValueOnce('refresh token');

      jest.spyOn(authService, 'parseAccessToken');
      jest.spyOn(authService, 'parseRefreshToken');
      jest.spyOn(authService, 'getAccessToken');
      jest.spyOn(authService, 'getRefreshToken');

      const { accessToken, refreshToken, userAuth } = await authService.refresh(
        oldAccessToken,
        oldRefreshToken,
      );

      expect(authService.parseAccessToken).toBeCalledWith(oldAccessToken);
      expect(authService.parseAccessToken).toBeCalledTimes(1);
      expect(authService.parseRefreshToken).toBeCalledWith(oldRefreshToken);
      expect(authService.parseRefreshToken).toBeCalledTimes(1);
      expect(authService.getAccessToken).toBeCalledWith(accessTokenPayload);
      expect(authService.getAccessToken).toBeCalledTimes(1);
      expect(authService.getRefreshToken).toBeCalledWith(refreshTokenPayload);
      expect(authService.getRefreshToken).toBeCalledTimes(1);
      expect(accessToken).toBe('access token');
      expect(refreshToken).toBe('refresh token');
      expect(userAuth).toEqual(accessTokenPayload);
    });

    it('should return an access token, refresh token, and UserAuth object if the access token is bad but the refresh token is good', async () => {
      const oldAccessToken = 'old access token';
      const oldRefreshToken = 'old refresh token';

      const accessTokenPayload = { id: '1234', roles: [Role.USER] };
      const refreshTokenPayload = { id: '1234', sessionId: '5678' };

      (jwt.verify as jest.Mock)
        .mockImplementationOnce(() => {
          throw new Error();
        })
        .mockImplementationOnce(() => refreshTokenPayload);

      (jwt.sign as jest.Mock)
        .mockReturnValueOnce('access token')
        .mockReturnValueOnce('refresh token');

      const mockUser = new User();
      mockUser.id = '1234';
      mockUser.sessionId = '5678';
      mockUser.roles = [Role.USER];

      mockRepository.findUser.mockResolvedValue(mockUser);

      jest.spyOn(authService, 'parseAccessToken');
      jest.spyOn(authService, 'parseRefreshToken');
      jest.spyOn(authService, 'getAccessToken');
      jest.spyOn(authService, 'getRefreshToken');

      const { accessToken, refreshToken, userAuth } = await authService.refresh(
        oldAccessToken,
        oldRefreshToken,
      );

      expect(authService.parseAccessToken).toBeCalledWith(oldAccessToken);
      expect(authService.parseAccessToken).toBeCalledTimes(1);
      expect(authService.parseRefreshToken).toBeCalledWith(oldRefreshToken);
      expect(authService.parseRefreshToken).toBeCalledTimes(1);
      expect(authService.getAccessToken).toBeCalledWith(accessTokenPayload);
      expect(authService.getAccessToken).toBeCalledTimes(1);
      expect(authService.getRefreshToken).toBeCalledWith(refreshTokenPayload);
      expect(authService.getRefreshToken).toBeCalledTimes(1);
      expect(accessToken).toBe('access token');
      expect(refreshToken).toBe('refresh token');
      expect(userAuth).toEqual(accessTokenPayload);
    });

    it('should throw a NotAuthorized if the refresh token is bad and the access token is bad', async () => {
      const oldAccessToken = 'old access token';
      const oldRefreshToken = 'old refresh token';

      (jwt.verify as jest.Mock)
        .mockImplementationOnce(() => {
          throw new Error();
        })
        .mockImplementationOnce(() => {
          throw new Error();
        });

      jest.spyOn(authService, 'parseAccessToken');
      jest.spyOn(authService, 'parseRefreshToken');
      jest.spyOn(authService, 'getAccessToken');
      jest.spyOn(authService, 'getRefreshToken');

      const error = await authService
        .refresh(oldAccessToken, oldRefreshToken)
        .catch(e => e);

      expect(authService.parseAccessToken).toBeCalledWith(oldAccessToken);
      expect(authService.parseAccessToken).toBeCalledTimes(1);
      expect(authService.parseRefreshToken).toBeCalledWith(oldRefreshToken);
      expect(authService.parseRefreshToken).toBeCalledTimes(1);
      expect(authService.getAccessToken).not.toBeCalled();
      expect(authService.getRefreshToken).not.toBeCalled();
      expect(mockRepository.findUser).not.toBeCalled();
      expect(error).toBeInstanceOf(NotAuthorized);
    });

    it('should throw a NotAuthorized if the refresh token is bad but the access token is good', async () => {
      const oldAccessToken = 'old access token';
      const oldRefreshToken = 'old refresh token';

      const refreshTokenPayload = { id: '1234', sessionId: '5678' };

      (jwt.verify as jest.Mock)
        .mockImplementationOnce(() => refreshTokenPayload)
        .mockImplementationOnce(() => {
          throw new Error();
        })
        .mockImplementationOnce(() => {
          throw new Error();
        });

      jest.spyOn(authService, 'parseAccessToken');
      jest.spyOn(authService, 'parseRefreshToken');
      jest.spyOn(authService, 'getAccessToken');
      jest.spyOn(authService, 'getRefreshToken');

      const error = await authService
        .refresh(oldAccessToken, oldRefreshToken)
        .catch(e => e);

      expect(authService.parseAccessToken).toBeCalledWith(oldAccessToken);
      expect(authService.parseAccessToken).toBeCalledTimes(1);
      expect(authService.parseRefreshToken).toBeCalledWith(oldRefreshToken);
      expect(authService.parseRefreshToken).toBeCalledTimes(2);
      expect(authService.getAccessToken).not.toBeCalled();
      expect(authService.getRefreshToken).not.toBeCalled();
      expect(mockRepository.findUser).not.toBeCalled();
      expect(error).toBeInstanceOf(NotAuthorized);
    });

    it('should throw a NotAuthorized if the user does not exist', async () => {
      const oldAccessToken = 'old access token';
      const oldRefreshToken = 'old refresh token';

      const refreshTokenPayload = { id: '1234', sessionId: '5678' };

      (jwt.verify as jest.Mock)
        .mockImplementationOnce(() => {
          throw new Error();
        })
        .mockImplementationOnce(() => refreshTokenPayload);

      (jwt.sign as jest.Mock)
        .mockReturnValueOnce('access token')
        .mockReturnValueOnce('refresh token');

      mockRepository.findUser.mockResolvedValue(undefined);

      jest.spyOn(authService, 'parseAccessToken');
      jest.spyOn(authService, 'parseRefreshToken');
      jest.spyOn(authService, 'getAccessToken');
      jest.spyOn(authService, 'getRefreshToken');

      const error = await authService
        .refresh(oldAccessToken, oldRefreshToken)
        .catch(e => e);

      expect(authService.parseAccessToken).toBeCalledWith(oldAccessToken);
      expect(authService.parseAccessToken).toBeCalledTimes(1);
      expect(authService.parseRefreshToken).toBeCalledWith(oldRefreshToken);
      expect(authService.parseRefreshToken).toBeCalledTimes(1);
      expect(authService.getAccessToken).not.toBeCalled();
      expect(authService.getRefreshToken).not.toBeCalled();
      expect(error).toBeInstanceOf(NotAuthorized);
    });

    it('should throw a NotAuthorized if the user has no sessionId', async () => {
      const oldAccessToken = 'old access token';
      const oldRefreshToken = 'old refresh token';

      const refreshTokenPayload = { id: '1234', sessionId: '5678' };

      (jwt.verify as jest.Mock)
        .mockImplementationOnce(() => {
          throw new Error();
        })
        .mockImplementationOnce(() => refreshTokenPayload);

      (jwt.sign as jest.Mock)
        .mockReturnValueOnce('access token')
        .mockReturnValueOnce('refresh token');

      const mockUser = new User();
      mockUser.id = '1234';
      mockUser.roles = [Role.USER];

      mockRepository.findUser.mockResolvedValue(mockUser);

      jest.spyOn(authService, 'parseAccessToken');
      jest.spyOn(authService, 'parseRefreshToken');
      jest.spyOn(authService, 'getAccessToken');
      jest.spyOn(authService, 'getRefreshToken');

      const error = await authService
        .refresh(oldAccessToken, oldRefreshToken)
        .catch(e => e);

      expect(authService.parseAccessToken).toBeCalledWith(oldAccessToken);
      expect(authService.parseAccessToken).toBeCalledTimes(1);
      expect(authService.parseRefreshToken).toBeCalledWith(oldRefreshToken);
      expect(authService.parseRefreshToken).toBeCalledTimes(1);
      expect(authService.getAccessToken).not.toBeCalled();
      expect(authService.getRefreshToken).not.toBeCalled();
      expect(error).toBeInstanceOf(NotAuthorized);
    });

    it('should throw a NotAuthorized if the user sessionId does not match the token sessionId', async () => {
      const oldAccessToken = 'old access token';
      const oldRefreshToken = 'old refresh token';

      const refreshTokenPayload = { id: '1234', sessionId: '5678' };

      (jwt.verify as jest.Mock)
        .mockImplementationOnce(() => {
          throw new Error();
        })
        .mockImplementationOnce(() => refreshTokenPayload);

      (jwt.sign as jest.Mock)
        .mockReturnValueOnce('access token')
        .mockReturnValueOnce('refresh token');

      const mockUser = new User();
      mockUser.id = '1234';
      mockUser.sessionId = '9012';
      mockUser.roles = [Role.USER];

      mockRepository.findUser.mockResolvedValue(mockUser);

      jest.spyOn(authService, 'parseAccessToken');
      jest.spyOn(authService, 'parseRefreshToken');
      jest.spyOn(authService, 'getAccessToken');
      jest.spyOn(authService, 'getRefreshToken');

      const error = await authService
        .refresh(oldAccessToken, oldRefreshToken)
        .catch(e => e);

      expect(authService.parseAccessToken).toBeCalledWith(oldAccessToken);
      expect(authService.parseAccessToken).toBeCalledTimes(1);
      expect(authService.parseRefreshToken).toBeCalledWith(oldRefreshToken);
      expect(authService.parseRefreshToken).toBeCalledTimes(1);
      expect(authService.getAccessToken).not.toBeCalled();
      expect(authService.getRefreshToken).not.toBeCalled();
      expect(error).toBeInstanceOf(NotAuthorized);
    });
  });
});
