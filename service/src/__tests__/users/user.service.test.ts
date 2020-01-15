import UserService from '../../users/users.service';
import Container from 'typedi';
import bcrypt from 'bcryptjs';
import NotFound from '../../errors/NotFound';
import { Repository } from 'typeorm';
import User from '../../users/users.entity';
import UserRepository from '../../users/users.repository';

const mockUser = {
  username: 'foo',
  password: 'bar',
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
      mockRepository.saveUser.mockResolvedValue({ id: 1, ...mockUser });
      await userService.addUser(mockUser);

      expect(bcrypt.hash).toBeCalledWith('bar', 10);
    });

    it('should call repository.saveUser with the user', async () => {
      mockRepository.saveUser.mockResolvedValue({ id: 1, ...mockUser });
      await userService.addUser(mockUser);

      const savedUser = {
        username: 'foo',
        password: 'hashedPassword',
      };

      expect(mockRepository.saveUser).toBeCalledWith(savedUser);
    });
  });

  describe('getUser', () => {
    it('should call repository.findUser with the user', async () => {
      mockRepository.findUser.mockResolvedValue({ id: 1, ...mockUser });
      await userService.getUser(1);

      expect(mockRepository.findUser).toBeCalledWith(1);
    });

    it('should reject the promise and throw an error if no user is found', async () => {
      mockRepository.findUser.mockResolvedValue(undefined);
      const error = await userService.getUser(2).catch(e => e);

      expect(async () => await userService.getUser(2)).rejects;
      expect(error).toBeInstanceOf(NotFound);
    });
  });
});
