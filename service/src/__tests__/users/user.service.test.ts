import UserService from '../../users/users.service';
import Container from 'typedi';

const mockUser = {
  username: 'foo',
  password: 'bar',
};

class MockRepository {
  saveUser = jest.fn();
  findUser = jest.fn();
}

describe('UserService', () => {
  let userService: UserService;
  const mockRepository = new MockRepository();

  beforeAll(() => {
    Container.set(UserService, new UserService(mockRepository as any));
    userService = Container.get(UserService);
  });

  describe('addUser', () => {
    it('should call repository.saveUser with the user', async () => {
      await userService.addUser(mockUser as any);

      expect(mockRepository.saveUser).toBeCalledWith(mockUser);
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
      expect(error).toBeInstanceOf(Error);
    });
  });
});
