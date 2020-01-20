import AuthService from '../../auth/auth.service';
import Container from 'typedi';
import bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import User from '../../users/entities/users.entity';
import UserRepository from '../../users/users.repository';
import { Role } from '../../auth/models/Role';
import NotAuthorized from '../../errors/NotAuthorized';

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
});
