import UserService from '../../users/users.service';
import Container from 'typedi';
import bcrypt from 'bcryptjs';
import NotFound from '../../errors/NotFound';
import { Repository } from 'typeorm';
import User from '../../users/entities/users.entity';
import UserRepository from '../../users/users.repository';
import { Role } from '../../auth/models/Role';

const mockUser = new User();

mockUser.id = '1';
mockUser.username = 'foo';
mockUser.password = 'bar';
mockUser.roles = [Role.USER];

class MockRepository {
  private repository: Repository<User>;
  saveUser = jest.fn();
  findUser = jest.fn();
}

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

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
    it('should bcrypt.hash and hash the password', async () => {
      mockRepository.saveUser.mockResolvedValue(mockUser);
      await userService.addUser({
        username: 'foo',
        password: 'bar',
        roles: [Role.USER],
      });

      expect(bcrypt.hash).toBeCalledWith('bar', 10);
    });

    it('should call repository.saveUser with the user', async () => {
      mockRepository.saveUser.mockResolvedValue(mockUser);
      await userService.addUser({
        username: 'foo',
        password: 'bar',
        roles: [Role.USER],
      });

      const savedUser = {
        username: 'foo',
        password: 'hashedPassword',
        roles: [Role.USER],
      };

      expect(mockRepository.saveUser).toBeCalledWith(savedUser);
    });

    it('should return a user after save', async () => {
      const value = mockRepository.saveUser.mockResolvedValue(mockUser);

      const savedUser = await userService.addUser({
        username: 'foo',
        password: 'bar',
        roles: [Role.USER],
      });

      const expectedUser = {
        id: '1',
        username: 'foo',
        roles: [Role.USER],
      };

      expect(savedUser).toEqual(expectedUser);
    });
  });

  describe('getUser', () => {
    it('should call repository.findUser with the user', async () => {
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
});
