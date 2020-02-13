import Container from 'typedi';
import UserService from '../../users/users.service';
import {
  addUser,
  getUser,
  getAllUsers,
  disableAccount,
  resetPassword,
  changePassword,
  updateUser,
  authorizedToUpdateUserPassword,
  authorizedToUpdateUser,
  authorizedToDisableUser,
  authorizedToReadUser,
  authorizedToReadAllUsers,
  authorizedToCreateUser,
} from '../../users/users.handlers';
import { Role } from '../../auth/Role.model';
import Forbidden from '../../errors/Forbidden';

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
  updateUser = jest.fn();
  getUser = jest.fn();
  getAllUsers = jest.fn();
  disableAccount = jest.fn();
  resetForgottenPassword = jest.fn();
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

      expect(userService.addUser).toBeCalledWith(mockUser);
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

  describe('updateUser', () => {
    it('should call userService.updateUser with the updated user', async () => {
      const mockReq = {
        body: mockUser,
        params: { id: '1' },
        user: { id: '1', roles: [Role.ADMIN] },
      };

      userService.updateUser.mockResolvedValue({ id: '1', ...mockUser });

      await updateUser(mockReq as any, mockRes as any, jest.fn());

      expect(userService.updateUser).toBeCalledWith('1', mockUser);
    });

    it('should call res.send with the returned user', async () => {
      const mockReq = {
        body: mockUser,
        params: { id: '1' },
        user: { id: '1', roles: [Role.ADMIN] },
      };

      userService.updateUser.mockResolvedValue({ id: '1', ...mockUser });

      await updateUser(mockReq as any, mockRes as any, jest.fn());

      expect(mockRes.json).toBeCalledWith({ id: '1', ...mockUser });
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
        params: { id: '1', passwordResetId: 'aaa' },
        body: { password: 'foobarbaz' },
      };

      await resetPassword(mockReq as any, mockRes as any, jest.fn());

      expect(userService.resetForgottenPassword).toBeCalledWith(
        mockReq.params.id,
        mockReq.params.passwordResetId,
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

  describe('getAllUsers', () => {
    it('should call userService.getAllUsers', async () => {
      await getAllUsers({} as any, mockRes as any, jest.fn());

      expect(userService.getAllUsers).toBeCalledWith();
    });

    it('should res.json with the users', async () => {
      userService.getAllUsers.mockResolvedValue([mockUser]);
      await getAllUsers({} as any, mockRes as any, jest.fn());

      expect(mockRes.json).toBeCalledWith([mockUser]);
    });
  });

  describe('authorizedToUpdateUserPassword', () => {
    it('should call next with nothing if the user is authorized', async () => {
      const mockReq = {
        params: { id: '1' },
        body: { password: 'foobarbaz' },
        user: { id: '1', roles: [Role.ADMIN] },
      };

      const next = jest.fn();
      await authorizedToUpdateUserPassword(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith();
    });

    it('should call next with Forbidden if the user is not authorized', async () => {
      const mockReq = {
        params: { id: '2' },
        body: { password: 'foobarbaz' },
        user: { id: '1', roles: [Role.ADMIN] },
      };

      const next = jest.fn();
      await authorizedToUpdateUserPassword(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith(expect.any(Forbidden));
    });
  });

  describe('authorizedToUpdateUser', () => {
    it('should call next with nothing if the user is a super admin', async () => {
      const mockReq = {
        params: { id: '1' },
        body: { roles: [Role.ADMIN] },
        user: { id: '1', roles: [Role.SUPER_ADMIN] },
      };

      userService.getUser.mockResolvedValue({ roles: [Role.ADMIN] });

      const next = jest.fn();
      await authorizedToUpdateUser(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith();
    });

    it('should call next with nothing if the user is an admin and updating the correct permissions', async () => {
      const mockReq = {
        params: { id: '1' },
        body: { roles: [Role.USER] },
        user: { id: '1', roles: [Role.ADMIN] },
      };

      userService.getUser.mockResolvedValue({ roles: [Role.USER] });

      const next = jest.fn();
      await authorizedToUpdateUser(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith();
    });

    it('should call next with Forbidden if the user is a user', async () => {
      const mockReq = {
        params: { id: '1' },
        body: { roles: [Role.USER] },
        user: { id: '1', roles: [Role.USER] },
      };

      userService.getUser.mockResolvedValue({ roles: [Role.USER] });

      const next = jest.fn();
      await authorizedToUpdateUser(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith(expect.any(Forbidden));
    });

    it('should call next with Forbidden if the user is an admin and updating an admin', async () => {
      const mockReq = {
        params: { id: '1' },
        body: { roles: [Role.USER] },
        user: { id: '1', roles: [Role.ADMIN] },
      };

      userService.getUser.mockResolvedValue({ roles: [Role.ADMIN] });

      const next = jest.fn();
      await authorizedToUpdateUser(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith(expect.any(Forbidden));
    });

    it('should call next with Forbidden if the user is an admin and updating a super admin', async () => {
      const mockReq = {
        params: { id: '1' },
        body: { roles: [Role.USER] },
        user: { id: '1', roles: [Role.ADMIN] },
      };

      userService.getUser.mockResolvedValue({ roles: [Role.SUPER_ADMIN] });

      const next = jest.fn();
      await authorizedToUpdateUser(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith(expect.any(Forbidden));
    });

    it('should call next with Forbidden if the user is an admin and granting admin permissions', async () => {
      const mockReq = {
        params: { id: '1' },
        body: { roles: [Role.ADMIN] },
        user: { id: '1', roles: [Role.ADMIN] },
      };

      userService.getUser.mockResolvedValue({ roles: [Role.USER] });

      const next = jest.fn();
      await authorizedToUpdateUser(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith(expect.any(Forbidden));
    });

    it('should call next with Forbidden if the user is an admin and granting super admin permissions', async () => {
      const mockReq = {
        params: { id: '1' },
        body: { roles: [Role.SUPER_ADMIN] },
        user: { id: '1', roles: [Role.ADMIN] },
      };

      userService.getUser.mockResolvedValue({ roles: [Role.USER] });

      const next = jest.fn();
      await authorizedToUpdateUser(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith(expect.any(Forbidden));
    });
  });

  describe('authorizedToDisableUser', () => {
    it('should call next with nothing if the user is a super admin', async () => {
      const mockReq = {
        params: { id: '2' },
        user: { id: '1', roles: [Role.SUPER_ADMIN] },
      };

      userService.getUser.mockResolvedValue({ roles: [Role.USER] });

      const next = jest.fn();
      await authorizedToDisableUser(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith();
    });

    it('should call next with nothing if the user is an admin and disabling a user', async () => {
      const mockReq = {
        params: { id: '2' },
        user: { id: '1', roles: [Role.ADMIN] },
      };

      userService.getUser.mockResolvedValue({ roles: [Role.USER] });

      const next = jest.fn();
      await authorizedToDisableUser(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith();
    });

    it('should call next with Forbidden if the user is a user', async () => {
      const mockReq = {
        params: { id: '1' },
        user: { id: '1', roles: [Role.USER] },
      };

      userService.getUser.mockResolvedValue({ roles: [Role.USER] });

      const next = jest.fn();
      await authorizedToDisableUser(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith(expect.any(Forbidden));
    });

    it('should call next with Forbidden if the user is an admin and disabling an admin', async () => {
      const mockReq = {
        params: { id: '1' },
        body: { roles: [Role.USER] },
        user: { id: '1', roles: [Role.ADMIN] },
      };

      userService.getUser.mockResolvedValue({ roles: [Role.ADMIN] });

      const next = jest.fn();
      await authorizedToDisableUser(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith(expect.any(Forbidden));
    });

    it('should call next with Forbidden if the user is an admin and disabling a super admin', async () => {
      const mockReq = {
        params: { id: '1' },
        body: { roles: [Role.USER] },
        user: { id: '1', roles: [Role.ADMIN] },
      };

      userService.getUser.mockResolvedValue({ roles: [Role.SUPER_ADMIN] });

      const next = jest.fn();
      await authorizedToDisableUser(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith(expect.any(Forbidden));
    });
  });

  describe('authorizedToReadUser', () => {
    it('should call next with nothing if the user is an admin', async () => {
      const mockReq = {
        params: { id: '2' },
        user: { id: '1', roles: [Role.ADMIN] },
      };

      const next = jest.fn();
      await authorizedToReadUser(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith();
    });

    it('should call next with nothing if the user is the requested user', async () => {
      const mockReq = {
        params: { id: '1' },
        user: { id: '1', roles: [Role.USER] },
      };

      const next = jest.fn();
      await authorizedToReadUser(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith();
    });

    it('should call next with Forbidden if the user is not the requested user', async () => {
      const mockReq = {
        params: { id: '2' },
        user: { id: '1', roles: [Role.USER] },
      };

      const next = jest.fn();
      await authorizedToReadUser(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith(expect.any(Forbidden));
    });
  });

  describe('authorizedToReadAllUsers', () => {
    it('should call next with nothing if the user is an admin', async () => {
      const mockReq = {
        user: { id: '1', roles: [Role.ADMIN] },
      };

      const next = jest.fn();
      await authorizedToReadAllUsers(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith();
    });

    it('should call next with Forbidden if the user is not an admin', async () => {
      const mockReq = {
        user: { id: '1', roles: [Role.USER] },
      };

      const next = jest.fn();
      await authorizedToReadAllUsers(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith(expect.any(Forbidden));
    });
  });

  describe('authorizedToReadAllUsers', () => {
    it('should call next with nothing if the user is a super admin', async () => {
      const mockReq = {
        body: { roles: [Role.USER] },
        user: { id: '1', roles: [Role.SUPER_ADMIN] },
      };

      const next = jest.fn();
      await authorizedToCreateUser(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith();
    });

    it('should call next with nothing if the user is an admin and is adding allowed roles', async () => {
      const mockReq = {
        body: { roles: [Role.USER] },
        user: { id: '1', roles: [Role.ADMIN] },
      };

      const next = jest.fn();
      await authorizedToCreateUser(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith();
    });

    it('should call next with Forbidden if the user is not an admin', async () => {
      const mockReq = {
        body: { roles: [Role.USER] },
        user: { id: '1', roles: [Role.USER] },
      };

      const next = jest.fn();
      await authorizedToCreateUser(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith(expect.any(Forbidden));
    });

    it('should call next with Forbidden if the is an admin and adding an admin role', async () => {
      const mockReq = {
        body: { roles: [Role.ADMIN] },
        user: { id: '1', roles: [Role.ADMIN] },
      };

      const next = jest.fn();
      await authorizedToCreateUser(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith(expect.any(Forbidden));
    });

    it('should call next with Forbidden if the is an admin and adding a super admin role', async () => {
      const mockReq = {
        body: { roles: [Role.SUPER_ADMIN] },
        user: { id: '1', roles: [Role.ADMIN] },
      };

      const next = jest.fn();
      await authorizedToCreateUser(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith(expect.any(Forbidden));
    });
  });
});
