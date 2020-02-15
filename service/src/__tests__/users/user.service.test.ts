import bcrypt from 'bcryptjs';
import Container from 'typedi';
import { Repository } from 'typeorm';
import uuid from 'uuid/v4';
import { Role } from '../../auth/Role.model';
import EmailService from '../../email/email.service';
import BadRequest from '../../errors/BadRequest';
import NotAuthorized from '../../errors/NotAuthorized';
import NotFound from '../../errors/NotFound';
import User from '../../users/users.entity';
import UserRepository from '../../users/users.repository';
import UserService from '../../users/users.service';

const mockUser = new User();

mockUser.id = '1';
mockUser.username = 'foo';
mockUser.password = 'bar';
mockUser.roles = [Role.USER];
mockUser.email = 'email@example.com';
mockUser.firstName = 'foo';
mockUser.lastName = 'bar';

class MockRepository {
  private repository: Repository<User>;
  saveUser = jest.fn();
  findUser = jest.fn();
  findAllUsers = jest.fn();
  findUserByEmail = jest.fn();
  countUsersByUsernameOrEmail = jest.fn();
}

class MockEmailService {
  sendNewUserEmail = jest.fn().mockResolvedValue('<html>email</html>');
}

jest.mock('uuid/v4', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue('5678'),
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

jest.mock('shortid', () => jest.fn().mockReturnValue('shortid'));

beforeEach(jest.clearAllMocks);

describe('UserService', () => {
  let userService: UserService;
  const mockRepository = new MockRepository();
  const mockEmailService = new MockEmailService();

  beforeAll(() => {
    Container.set(
      UserService,
      new UserService(
        (mockRepository as unknown) as UserRepository,
        (mockEmailService as unknown) as EmailService,
      ),
    );
    userService = Container.get(UserService);
  });

  describe('addUser', () => {
    it('should check to see if the user already exists', async () => {
      mockRepository.saveUser.mockResolvedValue(mockUser);
      mockRepository.countUsersByUsernameOrEmail.mockResolvedValue([[], 0]);

      await userService.addUser({
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
      });

      expect(mockRepository.countUsersByUsernameOrEmail).toBeCalledWith(
        'foo',
        'email@example.com',
      );
    });

    it('should call uuid to generate a sessionId', async () => {
      mockRepository.saveUser.mockResolvedValue(mockUser);
      await userService.addUser({
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
      });

      expect(uuid).toBeCalled();
    });

    it('should call repository.saveUser with the user', async () => {
      mockRepository.saveUser.mockResolvedValue(mockUser);
      await userService.addUser({
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
      });

      const savedUser = {
        username: 'foo',
        email: 'email@example.com',
        sessionId: '5678',
        passwordExpiration: expect.any(Date),
        passwordResetId: 'shortid',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
      };

      expect(mockRepository.saveUser).toBeCalledWith(savedUser);
    });

    it('should call emailService.sendNewUserEmail with the user', async () => {
      mockRepository.saveUser.mockResolvedValue(mockUser);
      await userService.addUser({
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
      });

      expect(mockEmailService.sendNewUserEmail).toBeCalledWith(mockUser);
    });

    it('should return a user after save', async () => {
      mockRepository.saveUser.mockResolvedValue(mockUser);

      const savedUser = await userService.addUser({
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
      });

      const expectedUser = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
        name: 'foo bar',
        gravatar: expect.any(String),
      };

      expect(savedUser).toEqual(expectedUser);
    });

    it('should throw a BadRequest if the user already exists', async () => {
      mockRepository.countUsersByUsernameOrEmail.mockResolvedValue([[], 1]);

      const error = await userService
        .addUser({
          username: 'foo',
          email: 'email@example.com',
          roles: [Role.USER],
          firstName: 'foo',
          lastName: 'bar',
        })
        .catch(e => e);

      expect(error).toBeInstanceOf(BadRequest);
    });
  });

  describe('updateUser', () => {
    it('should return an updated user', async () => {
      mockRepository.findUser.mockResolvedValue(mockUser);
      mockRepository.countUsersByUsernameOrEmail.mockResolvedValue([
        [mockUser],
        1,
      ]);

      const updatedUser = {
        username: 'foobar',
        firstName: 'foo',
        lastName: 'bar',
        roles: [Role.USER],
        email: 'email@example.com',
      };

      mockRepository.saveUser.mockResolvedValue({
        ...mockUser,
        username: updatedUser.username,
      });

      const user = await userService.updateUser('1', updatedUser);

      expect(user).toEqual({
        ...mockUser,
        username: updatedUser.username,
      });
    });

    it('should should call repository.saveUser', async () => {
      mockRepository.findUser.mockResolvedValue(mockUser);
      mockRepository.countUsersByUsernameOrEmail.mockResolvedValue([
        [mockUser],
        1,
      ]);

      const updatedUser = {
        username: 'foobar',
        firstName: 'foo',
        lastName: 'bar',
        roles: [Role.USER],
        email: 'email@example.com',
      };

      await userService.updateUser('1', updatedUser);

      expect(mockRepository.saveUser).toBeCalledWith({
        ...mockUser,
        username: updatedUser.username,
      });
    });

    it('should throw a NotFound if the user cannot be found', async () => {
      mockRepository.findUser.mockResolvedValue(undefined);
      const updatedUser = {
        username: 'foobar',
        firstName: 'foo',
        lastName: 'bar',
        roles: [Role.USER],
        email: 'email@example.com',
      };

      const error = await userService
        .updateUser('1', updatedUser)
        .catch(e => e);

      expect(error).toBeInstanceOf(NotFound);
    });

    it('should should call repository.saveUser', async () => {
      mockRepository.findUser.mockResolvedValue(mockUser);
      mockRepository.countUsersByUsernameOrEmail.mockResolvedValue([
        [mockUser],
        1,
      ]);

      const updatedUser = {
        username: 'foobar',
        firstName: 'foo',
        lastName: 'bar',
        roles: [Role.USER],
        email: 'email@example.com',
      };

      await userService.updateUser('1', updatedUser);

      expect(mockRepository.saveUser).toBeCalledWith({
        ...mockUser,
        username: updatedUser.username,
      });
    });

    it('should throw a BadRequest if a unique constraint is violated', async () => {
      mockRepository.findUser.mockResolvedValue(mockUser);
      mockRepository.countUsersByUsernameOrEmail.mockResolvedValue([
        [{ ...mockUser, id: '2' }],
        1,
      ]);

      const updatedUser = {
        username: 'foobar',
        firstName: 'foo',
        lastName: 'bar',
        roles: [Role.USER],
        email: 'email@example.com',
      };

      const error = await userService
        .updateUser('1', updatedUser)
        .catch(e => e);

      expect(error).toBeInstanceOf(BadRequest);
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
        sessionId: null,
      };

      expect(mockRepository.saveUser).toBeCalledWith(expectedUser);
    });

    it('should throw a NotFound if the user cannot be found', async () => {
      mockRepository.findUser.mockResolvedValue(undefined);
      const error = await userService.disableAccount('1').catch(e => e);

      expect(error).toBeInstanceOf(NotFound);
    });
  });

  describe('enableAccount', () => {
    it('should call repository.findUser with the user id', async () => {
      mockRepository.findUser.mockResolvedValue({
        id: '1',
        ...mockUser,
      });

      await userService.enableAccount('1');

      expect(mockRepository.findUser).toBeCalledWith('1');
    });

    it('should call repository.save with the updated user', async () => {
      mockRepository.findUser.mockResolvedValue({
        id: '1',
        ...mockUser,
      });
      await userService.enableAccount('1');

      const expectedUser = {
        ...mockUser,
        id: '1',
        sessionId: '5678',
      };

      expect(mockRepository.saveUser).toBeCalledWith(expectedUser);
    });

    it('should throw a NotFound if the user cannot be found', async () => {
      mockRepository.findUser.mockResolvedValue(undefined);
      const error = await userService.enableAccount('1').catch(e => e);

      expect(error).toBeInstanceOf(NotFound);
    });
  });

  describe('resetPassword', () => {
    it('should call repository.findUser with the user id', async () => {
      mockRepository.findUser.mockResolvedValue({
        id: '1',
        passwordExpiration: new Date(Date.now() + 3600000),
        passwordResetId: 'shortid',
        ...mockUser,
      });

      const password = 'foobarbaz';

      await userService.resetForgottenPassword('1', 'shortid', password);

      expect(mockRepository.findUser).toBeCalledWith('1');
    });

    it('should call bcrypt.hash with the password', async () => {
      mockRepository.findUser.mockResolvedValue({
        id: '1',
        passwordExpiration: new Date(Date.now() + 3600000),
        passwordResetId: 'shortid',
        ...mockUser,
      });

      const password = 'foobarbaz';

      await userService.resetForgottenPassword('1', 'shortid', password);

      expect(bcrypt.hash).toBeCalledWith(password, 10);
    });

    it('should call repository.saveUser with the updated user', async () => {
      const user = {
        id: '1',
        passwordExpiration: new Date(Date.now() + 3600000),
        passwordResetId: 'shortid',
        ...mockUser,
      };
      mockRepository.findUser.mockResolvedValue(user);

      const password = 'foobarbaz';

      await userService.resetForgottenPassword('1', 'shortid', password);

      const expectedUser = {
        ...mockUser,
        passwordExpiration: null,
        passwordResetId: 'shortid',
        password: 'hashedPassword',
      };

      expect(mockRepository.saveUser).toBeCalledWith(expectedUser);
    });

    it('should throw a NotAuthorized if there is no password expiration', async () => {
      const user = {
        id: '1',
        passwordResetId: 'shortid',
        ...mockUser,
      };
      mockRepository.findUser.mockResolvedValue(user);

      const password = 'foobarbaz';

      const error = await userService
        .resetForgottenPassword('1', 'shortid', password)
        .catch(e => e);

      expect(error).toBeInstanceOf(NotAuthorized);
    });

    it('should throw a NotAuthorized if the shortids do not match', async () => {
      const user = {
        id: '1',
        passwordExpiration: new Date(Date.now() + 3600000),
        passwordResetId: 'shortid2',
        ...mockUser,
      };
      mockRepository.findUser.mockResolvedValue(user);

      const password = 'foobarbaz';

      const error = await userService
        .resetForgottenPassword('1', 'shortid', password)
        .catch(e => e);

      expect(error).toBeInstanceOf(NotAuthorized);
    });

    it('should throw a NotAuthorized if the password expiration has elapsed', async () => {
      const user = {
        id: '1',
        passwordResetId: 'shortid',
        passwordExpiration: new Date(Date.now() - 3600000),
        ...mockUser,
      };
      mockRepository.findUser.mockResolvedValue(user);

      const password = 'foobarbaz';

      const error = await userService
        .resetForgottenPassword('1', 'shortid', password)
        .catch(e => e);

      expect(error).toBeInstanceOf(NotAuthorized);
    });

    it('should throw a NotAuthorized if no user can be found', async () => {
      mockRepository.findUser.mockResolvedValue(undefined);

      const password = 'foobarbaz';

      const error = await userService
        .resetForgottenPassword('1', 'shortid', password)
        .catch(e => e);

      expect(error).toBeInstanceOf(NotAuthorized);
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

  describe('getAllUsers', () => {
    it('should call repository.findAllUsers', async () => {
      mockRepository.findAllUsers.mockResolvedValue([]);

      await userService.getAllUsers();

      expect(mockRepository.findAllUsers).toBeCalledWith();
    });

    it('should transform the array of users', async () => {
      mockRepository.findAllUsers.mockResolvedValue([mockUser]);

      const users = await userService.getAllUsers();

      expect(users).toHaveLength(1);
      expect(users[0]).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        name: `${mockUser.firstName} ${mockUser.lastName}`,
        gravatar: expect.any(String),
        email: mockUser.email,
        roles: mockUser.roles,
      });
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
