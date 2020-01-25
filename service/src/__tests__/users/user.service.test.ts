import bcrypt from 'bcryptjs';
import Container from 'typedi';
import { Repository } from 'typeorm';
import uuid from 'uuid/v4';
import { Role } from '../../auth/models/Role';
import BadRequest from '../../errors/BadRequest';
import Forbidden from '../../errors/Forbidden';
import NotAuthorized from '../../errors/NotAuthorized';
import NotFound from '../../errors/NotFound';
import User from '../../users/entities/users.entity';
import UserRepository from '../../users/users.repository';
import UserService from '../../users/users.service';

const mockUser = new User();

mockUser.id = '1';
mockUser.username = 'foo';
mockUser.password = 'bar';
mockUser.roles = [Role.USER];
mockUser.email = 'email@example.com';

class MockRepository {
  private repository: Repository<User>;
  saveUser = jest.fn();
  findUser = jest.fn();
  findUserByEmail = jest.fn();
  countUsersByUsernameOrEmail = jest.fn();
}

jest.mock('uuid/v4', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue('5678'),
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

beforeEach(jest.clearAllMocks);

describe('UserService', () => {
  let userService: UserService;
  const mockRepository = new MockRepository();

  beforeAll(() => {
    Container.set(
      UserService,
      new UserService((mockRepository as unknown) as UserRepository),
    );
    userService = Container.get(UserService);
  });

  describe('addUser', () => {
    it('should check to see if the user already exists', async () => {
      await userService.addUser({
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
      });

      expect(mockRepository.countUsersByUsernameOrEmail).toBeCalledWith(
        'foo',
        'email@example.com',
      );
    });

    it('should call uuid to generate a sessionId', async () => {
      await userService.addUser({
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
      });

      expect(uuid).toBeCalled();
    });

    it('should call repository.saveUser with the user', async () => {
      mockRepository.saveUser.mockResolvedValue(mockUser);
      await userService.addUser({
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
      });

      const savedUser = {
        username: 'foo',
        email: 'email@example.com',
        sessionId: '5678',
        passwordExpiration: expect.any(Date),
        roles: [Role.USER],
      };

      expect(mockRepository.saveUser).toBeCalledWith(savedUser);
    });

    it('should return a user after save', async () => {
      mockRepository.saveUser.mockResolvedValue(mockUser);

      const savedUser = await userService.addUser({
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
      });

      const expectedUser = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
      };

      expect(savedUser).toEqual(expectedUser);
    });

    it('should throw a BadRequest if the user already exists', async () => {
      mockRepository.countUsersByUsernameOrEmail.mockResolvedValue(1);

      const error = await userService
        .addUser({
          username: 'foo',
          email: 'email@example.com',
          roles: [Role.USER],
        })
        .catch(e => e);

      expect(error).toBeInstanceOf(BadRequest);
    });
  });

  describe('requestResetPassword', () => {
    it('should call repository.findUser with the email', async () => {
      mockRepository.findUserByEmail.mockResolvedValue({
        id: '1',
        ...mockUser,
      });
      await userService.requestResetPassword('email@example.com');

      expect(mockRepository.findUserByEmail).toBeCalledWith(
        'email@example.com',
      );
    });

    it('should call repository.save with the updated user', async () => {
      mockRepository.findUserByEmail.mockResolvedValue({
        id: '1',
        ...mockUser,
      });
      await userService.requestResetPassword('email@example.com');

      const expectedUser = {
        ...mockUser,
        id: '1',
        passwordExpiration: expect.any(Date),
      };

      expect(mockRepository.saveUser).toBeCalledWith(expectedUser);
    });

    it('should not call userRepository.save if the user cannot be found', async () => {
      mockRepository.findUserByEmail.mockResolvedValue(undefined);
      await userService.requestResetPassword('foo@example.com');

      expect(mockRepository.saveUser).not.toBeCalled();
    });
  });

  describe('disableAccount', () => {
    it('should call repository.findUser with the user id', async () => {
      mockRepository.findUser.mockResolvedValue({
        id: '1',
        ...mockUser,
      });

      await userService.disableAccount('1');

      expect(mockRepository.findUser).toBeCalledWith('1');
    });

    it('should call repository.save with the updated user', async () => {
      mockRepository.findUser.mockResolvedValue({
        id: '1',
        ...mockUser,
      });
      await userService.disableAccount('1');

      const expectedUser = {
        ...mockUser,
        id: '1',
        sessionId: undefined,
      };

      expect(mockRepository.saveUser).toBeCalledWith(expectedUser);
    });

    it('should throw a NotFound if the user cannot be found', async () => {
      mockRepository.findUser.mockResolvedValue(undefined);
      const error = await userService.disableAccount('1').catch(e => e);

      expect(error).toBeInstanceOf(NotFound);
    });
  });

  describe('resetPassword', () => {
    it('should call repository.findUser with the user id', async () => {
      mockRepository.findUser.mockResolvedValue({
        id: '1',
        passwordExpiration: new Date(Date.now() + 3600000),
        ...mockUser,
      });

      const password = 'foobarbaz';

      await userService.resetPassword('1', password);

      expect(mockRepository.findUser).toBeCalledWith('1');
    });

    it('should call bcrypt.hash with the password', async () => {
      mockRepository.findUser.mockResolvedValue({
        id: '1',
        passwordExpiration: new Date(Date.now() + 3600000),
        ...mockUser,
      });

      const password = 'foobarbaz';

      await userService.resetPassword('1', password);

      expect(bcrypt.hash).toBeCalledWith(password, 10);
    });

    it('should call repository.saveUser with the updated user', async () => {
      const user = {
        id: '1',
        passwordExpiration: new Date(Date.now() + 3600000),
        ...mockUser,
      };
      mockRepository.findUser.mockResolvedValue(user);

      const password = 'foobarbaz';

      await userService.resetPassword('1', password);

      const expectedUser = { ...user, password: 'hashedPassword' };

      expect(mockRepository.saveUser).toBeCalledWith(expectedUser);
    });

    it('should throw a Forbidden if there is no password expiration', async () => {
      const user = {
        id: '1',
        ...mockUser,
      };
      mockRepository.findUser.mockResolvedValue(user);

      const password = 'foobarbaz';

      const error = await userService
        .resetPassword('1', password)
        .catch(e => e);

      expect(error).toBeInstanceOf(Forbidden);
    });

    it('should throw a Forbidden if the password expiration has elapsed', async () => {
      const user = {
        id: '1',
        passwordExpiration: new Date(Date.now() - 3600000),
        ...mockUser,
      };
      mockRepository.findUser.mockResolvedValue(user);

      const password = 'foobarbaz';

      const error = await userService
        .resetPassword('1', password)
        .catch(e => e);

      expect(error).toBeInstanceOf(Forbidden);
    });

    it('should throw a Forbidden if no user can be found', async () => {
      mockRepository.findUser.mockResolvedValue(undefined);

      const password = 'foobarbaz';

      const error = await userService
        .resetPassword('1', password)
        .catch(e => e);

      expect(error).toBeInstanceOf(Forbidden);
    });
  });

  describe('getUser', () => {
    it('should call repository.findUser with the user id', async () => {
      mockRepository.findUser.mockResolvedValue({
        id: '1',
        ...mockUser,
      });
      await userService.getUser('1');

      expect(mockRepository.findUser).toBeCalledWith('1');
    });

    it('should throw an error if no user is found', async () => {
      mockRepository.findUser.mockResolvedValue(undefined);
      const error = await userService.getUser('2').catch(e => e);

      expect(error).toBeInstanceOf(NotFound);
    });
  });

  describe('changePassword', () => {
    it('should call repository.findUser with user id', async () => {
      mockRepository.findUser.mockResolvedValue({
        id: '1',
        ...mockUser,
      });

      const password = 'foobarbaz';

      await userService.changePassword('1', password);

      expect(mockRepository.findUser).toBeCalledWith('1');
    });

    it('should call bcrypt.hash with the password', async () => {
      mockRepository.findUser.mockResolvedValue({
        id: '1',
        ...mockUser,
      });

      const password = 'foobarbaz';

      await userService.changePassword('1', password);

      expect(bcrypt.hash).toBeCalledWith(password, 10);
    });

    it('should call repository.saveUser with the updated user', async () => {
      const user = {
        id: '1',
        ...mockUser,
      };
      mockRepository.findUser.mockResolvedValue(user);

      const password = 'foobarbaz';

      await userService.changePassword('1', password);

      const expectedUser = { ...user, password: 'hashedPassword' };

      expect(mockRepository.saveUser).toBeCalledWith(expectedUser);
    });

    it('should throw a NotFound if no user can be found', async () => {
      mockRepository.findUser.mockResolvedValue(undefined);

      const password = 'foobarbaz';

      const error = await userService
        .changePassword('1', password)
        .catch(e => e);

      expect(error).toBeInstanceOf(NotFound);
    });
  });
});
