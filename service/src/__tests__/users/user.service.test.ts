import UserService from '../../users/users.service';
import Container from 'typedi';
import bcrypt from 'bcryptjs';
import NotFound from '../../errors/NotFound';
import { Repository } from 'typeorm';
import User from '../../users/entities/users.entity';
import UserRepository from '../../users/users.repository';
import { Role } from '../../auth/models/Role';

const mockUser = {
  username: 'foo',
  password: 'bar',
  roles: [Role.USER],
};

class MockRepository {
  private repository: Repository<User>;
  saveUser = jest.fn();
  findUser = jest.fn();
}

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue('bar'),
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
      mockRepository.saveUser.mockResolvedValue({
        id: 1,
        ...mockUser,
        roles: 'USER',
      });
      await userService.addUser(mockUser);

      expect(bcrypt.hash).toBeCalledWith('bar', 10);
    });

    it('should convert an array of Roles to a string', async () => {
      mockRepository.saveUser.mockResolvedValue({
        id: 1,
        ...mockUser,
        roles: 'USER',
      });
      const savedUser = await userService.addUser(mockUser);

      const expectedUser = {
        id: 1,
        username: mockUser.username,
        roles: mockUser.roles,
      };

      expect(savedUser).toEqual(expectedUser);
    });

    it('should call repository.saveUser with the user', async () => {
      mockRepository.saveUser.mockResolvedValue({
        id: 1,
        ...mockUser,
        roles: 'USER',
      });
      await userService.addUser(mockUser);

      const savedUser = {
        username: 'foo',
        password: 'hashedPassword',
        roles: 'USER',
      };

      expect(mockRepository.saveUser).toBeCalledWith(savedUser);
    });
  });

  describe('getUser', () => {
    it('should call repository.findUser with the user', async () => {
      mockRepository.findUser.mockResolvedValue({
        id: 1,
        ...mockUser,
        roles: 'USER',
      });
      await userService.getUser(1);

      expect(mockRepository.findUser).toBeCalledWith(1);
    });

    it('should convert a string of Roles to an array', async () => {
      mockRepository.findUser.mockResolvedValue({
        id: 1,
        ...mockUser,
        roles: 'USER',
      });
      const retrievedUser = await userService.getUser(1);

      const expectedUser = {
        id: 1,
        username: mockUser.username,
        roles: mockUser.roles,
      };

      expect(retrievedUser).toEqual(expectedUser);
    });

    it('should reject the promise and throw an error if no user is found', async () => {
      mockRepository.findUser.mockResolvedValue(undefined);
      const error = await userService.getUser(2).catch(e => e);

      expect(async () => await userService.getUser(2)).rejects;
      expect(error).toBeInstanceOf(NotFound);
    });
  });
});
