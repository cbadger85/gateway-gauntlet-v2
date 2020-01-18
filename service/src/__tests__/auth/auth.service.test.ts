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

class MockRepository {
  private repository: Repository<User>;
  saveUser = jest.fn();
  findUser = jest.fn();
}

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

beforeEach(jest.clearAllMocks);

describe('UserService', () => {
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
      mockRepository.findUser.mockResolvedValue({
        id: 1,
        username: 'foo',
        password: 'bar',
        roles: 'USER',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const user = await authService.login(1, mockLoginRequest);

      const expectedUser = {
        id: 1,
        username: 'foo',
        roles: [Role.USER],
      };

      expect(mockRepository.findUser).toBeCalledWith(1);
      expect(bcrypt.compare).toBeCalledWith('bar', 'bar');
      expect(user).toEqual(expectedUser);
    });

    it('should throw NotAuthorized if the user cannot be found', async () => {
      mockRepository.findUser.mockResolvedValue(undefined);

      const error = await authService.login(1, mockLoginRequest).catch(e => e);

      expect(mockRepository.findUser).toBeCalledWith(1);
      expect(error).toBeInstanceOf(NotAuthorized);
      expect(bcrypt.compare).not.toBeCalled();
    });

    it('should throw NotAuthorized if the password is incorrect', async () => {
      mockRepository.findUser.mockResolvedValueOnce({
        id: 1,
        username: 'foo',
        password: 'baz',
        roles: 'USER',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const error = await authService.login(1, mockLoginRequest).catch(e => e);

      expect(mockRepository.findUser).toBeCalledWith(1);
      expect(bcrypt.compare).toBeCalledWith('bar', 'baz');
      expect(error).toBeInstanceOf(NotAuthorized);
    });
  });
});
