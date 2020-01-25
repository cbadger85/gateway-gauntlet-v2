import Container from 'typedi';
import UserService from '../../users/users.service';
import {
  addUser,
  getUser,
  requestResetPassword,
  disableAccount,
  resetPassword,
  changePassword,
} from '../../users/users.handlers';
import NotFound from '../../errors/NotFound';
import { Role } from '../../auth/models/Role';

const mockUser = {
  username: 'foo',
  password: 'bar',
  sessionId: '5678',
  email: 'foo@example.com',
  roles: [Role.USER],
};

const mockRes = {
  json: jest.fn().mockReturnThis(),
  sendStatus: jest.fn().mockReturnThis(),
};

class MockService {
  addUser = jest.fn();
  getUser = jest.fn();
  requestResetPassword = jest.fn();
  disableAccount = jest.fn();
  resetPassword = jest.fn();
  changePassword = jest.fn();
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
    it('should call userService.addUser with the user and the role of the reqUser', async () => {
      const mockReq = {
        body: mockUser,
        user: { id: '1', roles: [Role.ADMIN] },
      };

      userService.addUser.mockResolvedValue({ id: '1', ...mockUser });

      await addUser(mockReq as any, mockRes as any, jest.fn());

      expect(userService.addUser).toBeCalledWith(mockUser, [Role.ADMIN]);
    });

    it('should call userService.addUser with the user and an empty array if there is no reqUser', async () => {
      const mockReq = {
        body: mockUser,
      };

      userService.addUser.mockResolvedValue({ id: '1', ...mockUser });

      await addUser(mockReq as any, mockRes as any, jest.fn());

      expect(userService.addUser).toBeCalledWith(mockUser, []);
    });

    it('should call res.send with the returned user', async () => {
      const mockReq = {
        body: mockUser,
        user: { id: '1', roles: [Role.ADMIN] },
      };

      userService.addUser.mockResolvedValue({ id: '1', ...mockUser });

      await addUser(mockReq as any, mockRes as any, jest.fn());

      expect(mockRes.json).toBeCalledWith({ id: '1', ...mockUser });
    });
  });

  describe('requestResetPassword', () => {
    it('should call userService.requestResetPassword with the email', async () => {
      const mockReq = {
        body: { email: 'foo@example.com' },
      };

      await requestResetPassword(mockReq as any, mockRes as any, jest.fn());

      expect(userService.requestResetPassword).toBeCalledWith(
        mockReq.body.email,
      );
    });

    it('should call res.sendStatus with 204', async () => {
      const mockReq = {
        body: { email: 'foo@example.com' },
      };

      await requestResetPassword(mockReq as any, mockRes as any, jest.fn());

      expect(mockRes.sendStatus).toBeCalledWith(204);
    });
  });

  describe('disableAccount', () => {
    it('should call userService.disableAccount with the user id', async () => {
      const mockReq = {
        params: { id: '1' },
      };

      await disableAccount(mockReq as any, mockRes as any, jest.fn());

      expect(userService.disableAccount).toBeCalledWith(mockReq.params.id);
    });

    it('should call res.sendStatus with 204', async () => {
      const mockReq = {
        params: { id: '1' },
      };

      await disableAccount(mockReq as any, mockRes as any, jest.fn());

      expect(mockRes.sendStatus).toBeCalledWith(204);
    });
  });

  describe('resetPassword', () => {
    it('should call userService.resetPassword with the user id and new password', async () => {
      const mockReq = {
        params: { id: '1' },
        body: { password: 'foobarbaz' },
      };

      await resetPassword(mockReq as any, mockRes as any, jest.fn());

      expect(userService.resetPassword).toBeCalledWith(
        mockReq.params.id,
        mockReq.body.password,
      );
    });

    it('should call res.sendStatus with 204', async () => {
      const mockReq = {
        params: { id: '1' },
        body: { password: 'foobarbaz' },
      };

      await resetPassword(mockReq as any, mockRes as any, jest.fn());

      expect(mockRes.sendStatus).toBeCalledWith(204);
    });
  });

  describe('getUser', () => {
    it('should call userService.getUser with the user id', async () => {
      const mockReq = {
        params: { id: 1 },
      };

      userService.getUser.mockResolvedValue({ id: '1', ...mockUser });

      await getUser(mockReq as any, mockRes as any, jest.fn());

      expect(userService.getUser).toBeCalledWith(1);
    });

    it('should call res.send with the returned user', async () => {
      const mockReq = {
        params: { id: 1 },
      };

      userService.getUser.mockResolvedValue({ id: '1', ...mockUser });

      await getUser(mockReq as any, mockRes as any, jest.fn());

      expect(mockRes.json).toBeCalledWith({ id: '1', ...mockUser });
    });
  });

  describe('changePassword', () => {
    it('should call userService.resetPassword with the user id and new password', async () => {
      const mockReq = {
        params: { id: '1' },
        body: { password: 'foobarbaz' },
      };

      await changePassword(mockReq as any, mockRes as any, jest.fn());

      expect(userService.changePassword).toBeCalledWith(
        mockReq.params.id,
        mockReq.body.password,
      );
    });

    it('should call res.sendStatus with 204', async () => {
      const mockReq = {
        params: { id: '1' },
        body: { password: 'foobarbaz' },
      };

      await changePassword(mockReq as any, mockRes as any, jest.fn());

      expect(mockRes.sendStatus).toBeCalledWith(204);
    });
  });
});
