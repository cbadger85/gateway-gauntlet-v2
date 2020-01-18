import Container from 'typedi';
import UserService from '../../users/users.service';
import { addUser, getUser } from '../../users/users.handlers';
import NotFound from '../../errors/NotFound';
import { Role } from '../../auth/models/Role';

const mockUser = {
  username: 'foo',
  password: 'bar',
  roles: [Role.USER],
};

const mockReq = {
  body: mockUser,
  params: { id: 1 },
};

const mockRes = {
  send: jest.fn(),
};

class MockService {
  addUser = jest.fn();
  getUser = jest.fn();
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('users.handlers', () => {
  let userService: MockService;

  beforeAll(() => {
    Container.set(UserService, new MockService());
    userService = (Container.get(UserService) as unknown) as MockService;
  });

  describe('saveUser', () => {
    it('should call userService.addUser with the user', async () => {
      userService.addUser.mockResolvedValue({ id: '1', ...mockUser });

      await addUser(mockReq as any, mockRes as any, jest.fn());

      expect(userService.addUser).toBeCalledWith(mockUser);
    });

    it('should call res.send with the returned user', async () => {
      userService.addUser.mockResolvedValue({ id: '1', ...mockUser });

      await addUser(mockReq as any, mockRes as any, jest.fn());

      expect(mockRes.send).toBeCalledWith({ id: '1', ...mockUser });
    });
  });

  describe('getUser', () => {
    it('should call userService.getUser with the user id', async () => {
      userService.getUser.mockResolvedValue({ id: '1', ...mockUser });

      await getUser(mockReq as any, mockRes as any, jest.fn());

      expect(userService.getUser).toBeCalledWith(1);
    });

    it('should call res.send with the returned user', async () => {
      userService.getUser.mockResolvedValue({ id: '1', ...mockUser });

      await getUser(mockReq as any, mockRes as any, jest.fn());

      expect(mockRes.send).toBeCalledWith({ id: '1', ...mockUser });
    });

    it('should reject the promise if the userService.getUser fails', async () => {
      userService.getUser.mockRejectedValue(new NotFound('not found'));

      const error = await getUser(
        mockReq as any,
        mockRes as any,
        jest.fn(),
      ).catch((e: Error) => e);

      expect(error).toBeInstanceOf(NotFound);
    });
  });
});
