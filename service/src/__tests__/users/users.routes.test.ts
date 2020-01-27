import request from 'supertest';
import { Container } from 'typedi';
import server from '../../server';
import UserService from '../../users/users.service';
import NotFound from '../../errors/NotFound';
import { Role } from '../../auth/models/Role';
import BadRequest from '../../errors/BadRequest';
import AuthService from '../../auth/auth.service';
import Forbidden from '../../errors/Forbidden';

class MockService {
  addUser = jest.fn();
  requestResetPassword = jest.fn();
  disableAccount = jest.fn();
  resetPassword = jest.fn();
  getUser = jest.fn();
  changePassword = jest.fn();
  getAllUsers = jest.fn();
}

class MockAuthService {
  login = jest.fn();
  refresh = jest.fn();
}

beforeEach(jest.clearAllMocks);

describe('user.routes', () => {
  let userService: MockService;
  let authService: MockAuthService;

  beforeEach(() => {
    Container.set(UserService, new MockService());
    Container.set(AuthService, new MockAuthService());
    userService = (Container.get(UserService) as unknown) as MockService;
    authService = (Container.get(AuthService) as unknown) as MockAuthService;
  });
  describe('POST /users', () => {
    it('should call addUser', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        userAuth: { id: '2', roles: [Role.ADMIN] },
      });

      const savedUser = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
      };

      const sentUser = {
        username: 'foo',
        email: 'email@example.com',
        roles: ['USER'],
        firstName: 'foo',
        lastName: 'bar',
      };

      userService.addUser.mockResolvedValue(savedUser);
      const response = await request(await server())
        .post('/users')
        .send(sentUser)
        .expect(200);

      expect(userService.addUser).toBeCalledWith(sentUser);

      expect(response.body).toEqual(savedUser);
    });

    it('should send a 403 if the user is unauthorized to add a user', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        userAuth: { id: '2', roles: [Role.USER] },
      });

      const savedUser = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
      };

      const sentUser = {
        username: 'foo',
        email: 'email@example.com',
        roles: ['USER'],
        firstName: 'foo',
        lastName: 'bar',
      };

      userService.addUser.mockResolvedValue(savedUser);
      await request(await server())
        .post('/users')
        .send(sentUser)
        .expect(403);
    });

    it('should send a 403 if the user is trying to add a higher role than their own', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        userAuth: { id: '2', roles: [Role.ADMIN] },
      });

      const savedUser = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.ADMIN],
        firstName: 'foo',
        lastName: 'bar',
      };

      const sentUser = {
        username: 'foo',
        email: 'email@example.com',
        roles: ['ADMIN'],
        firstName: 'foo',
        lastName: 'bar',
      };

      userService.addUser.mockResolvedValue(savedUser);
      await request(await server())
        .post('/users')
        .send(sentUser)
        .expect(403);
    });

    it('should send a BadRequest if the request body is invalid', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        userAuth: { id: '2', roles: [Role.ADMIN] },
      });

      const response = await request(await server())
        .post('/users')
        .send({ username: 'foo', password: 'bar' })
        .expect(400);

      expect(response.body.errors).toHaveLength(4);
    });

    it('should send a BadRequest if the user already exists', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        userAuth: { id: '2', roles: [Role.ADMIN] },
      });

      const badRequest = new BadRequest('user already exists');

      const responseBody = {
        name: badRequest.name,
        message: badRequest.message,
        statusCode: badRequest.statusCode,
      };

      userService.addUser.mockRejectedValue(badRequest);

      const sentUser = {
        username: 'foo',
        email: 'email@example.com',
        roles: ['USER'],
        firstName: 'foo',
        lastName: 'bar',
      };

      const response = await request(await server())
        .post('/users')
        .send(sentUser)
        .expect(400);

      expect(response.body).toEqual(responseBody);
    });
  });

  describe('POST /users/:id/disable', () => {
    it('should call disableAccount', async () => {
      const retrievedUser = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
      };

      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        userAuth: { id: '2', roles: [Role.ADMIN] },
      });

      userService.getUser.mockResolvedValue(retrievedUser);

      userService.disableAccount.mockResolvedValue(undefined);

      await request(await server())
        .post('/users/1/disable')
        .expect(204);

      expect(userService.disableAccount).toBeCalledWith('1');
    });

    it('should return a 403 if the user is not authorized', async () => {
      const retrievedUser = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.ADMIN],
        firstName: 'foo',
        lastName: 'bar',
      };

      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        userAuth: { id: '2', roles: [Role.ADMIN] },
      });

      userService.getUser.mockResolvedValue(retrievedUser);

      userService.disableAccount.mockResolvedValue(undefined);

      await request(await server())
        .post('/users/1/disable')
        .expect(403);

      expect(userService.disableAccount).not.toBeCalled();
    });

    it('should return a 404 if the user cannot be found', async () => {
      const retrievedUser = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
      };

      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        userAuth: { id: '2', roles: [Role.ADMIN] },
      });

      userService.getUser.mockResolvedValueOnce(retrievedUser);
      userService.disableAccount.mockRejectedValue(new NotFound('not found'));

      await request(await server())
        .post('/users/1/disable')
        .expect(404);
    });
  });

  describe('POST /users/:id/password/:passwordResetId/reset', () => {
    it('should call resetPassword', async () => {
      userService.resetPassword.mockResolvedValue(undefined);

      await request(await server())
        .post('/users/1/password/aaa/reset')
        .send({ password: 'foobarbaz' })
        .expect(204);

      expect(userService.resetPassword).toBeCalledWith('1', 'aaa', 'foobarbaz');
    });

    it('should call send a 400 if the password is missing', async () => {
      userService.resetPassword.mockResolvedValue(undefined);

      await request(await server())
        .post('/users/1/password/aaa/reset')
        .expect(400);
    });

    it('should send a  403 if resetPassword throws a NotAuthorized', async () => {
      userService.resetPassword.mockRejectedValue(new Forbidden());

      await request(await server())
        .post('/users/1/password/aaa/reset')
        .send({ password: 'foobarbaz' })
        .expect(403);
    });
  });

  describe('GET /users/:id', () => {
    it('should call getUser', async () => {
      const retrievedUser = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
      };

      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        userAuth: { id: '1', roles: [Role.USER] },
      });

      userService.getUser.mockResolvedValue(retrievedUser);
      const response = await request(await server())
        .get('/users/1')
        .expect(200);

      expect(userService.getUser).toBeCalledWith('1');

      expect(response.body).toEqual(retrievedUser);
    });

    it('should return a forbidden error if the user is not the same as the requested user', async () => {
      const forbidden = new Forbidden();

      const responseBody = {
        name: forbidden.name,
        message: forbidden.message,
        statusCode: forbidden.statusCode,
      };

      const retrievedUser = {
        id: '2',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
      };

      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        userAuth: { id: '1', roles: [Role.USER] },
      });
      userService.getUser.mockResolvedValue(retrievedUser);
      const response = await request(await server())
        .get('/users/2')
        .expect(403);

      expect(userService.getUser).toBeCalledWith('2');

      expect(response.body).toEqual(responseBody);
    });

    it('should return an error if it failed to find the user', async () => {
      const notFound = new NotFound('user not found');

      const responseBody = {
        name: notFound.name,
        message: notFound.message,
        statusCode: notFound.statusCode,
      };

      userService.getUser.mockRejectedValue(notFound);
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        userAuth: { id: '1', roles: [Role.USER] },
      });

      const response = await request(await server())
        .get('/users/1')
        .expect(404);

      expect(response.body).toEqual(responseBody);
    });
  });

  describe('GET /users', () => {
    it('should call getUser', async () => {
      const retrievedUser1 = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
      };

      const retrievedUser2 = {
        id: '2',
        username: 'foo',
        email: 'email2@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
      };

      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        userAuth: { id: '1', roles: [Role.ADMIN] },
      });

      userService.getAllUsers.mockResolvedValue([
        retrievedUser1,
        retrievedUser2,
      ]);
      const response = await request(await server())
        .get('/users')
        .expect(200);

      expect(userService.getAllUsers).toBeCalledWith();

      expect(response.body).toEqual([retrievedUser1, retrievedUser2]);
    });

    it('should should send a 403 if the user is not authorized', async () => {
      const retrievedUser1 = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
      };

      const retrievedUser2 = {
        id: '2',
        username: 'foo',
        email: 'email2@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
      };

      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        userAuth: { id: '1', roles: [Role.USER] },
      });

      userService.getAllUsers.mockResolvedValue([
        retrievedUser1,
        retrievedUser2,
      ]);

      await request(await server())
        .get('/users')
        .expect(403);
    });
  });

  describe('PUT /:id/password', () => {
    it('should send a 204 if the user is changing their password', async () => {
      userService.changePassword.mockResolvedValue(undefined);
      const retrievedUser = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
      };

      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        userAuth: { id: '1', roles: [Role.USER] },
      });
      userService.getUser.mockResolvedValue(retrievedUser);
      await request(await server())
        .put('/users/1/password')
        .send({ password: 'foobarbaz' })
        .expect(204);

      expect(userService.changePassword).toBeCalledWith('1', 'foobarbaz');
    });

    it('should send a 204 if the admin is trying to change a users password', async () => {
      userService.changePassword.mockResolvedValue(undefined);
      const retrievedUser = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
      };

      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        userAuth: { id: '2', roles: [Role.ADMIN] },
      });
      userService.getUser.mockResolvedValue(retrievedUser);
      await request(await server())
        .put('/users/1/password')
        .send({ password: 'foobarbaz' })
        .expect(204);
    });

    it('should send a 403 if the admin is trying to change a admin password', async () => {
      userService.changePassword.mockResolvedValue(undefined);
      const retrievedUser = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.ADMIN],
        firstName: 'foo',
        lastName: 'bar',
      };

      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        userAuth: { id: '2', roles: [Role.ADMIN] },
      });
      userService.getUser.mockResolvedValue(retrievedUser);
      await request(await server())
        .put('/users/1/password')
        .send({ password: 'foobarbaz' })
        .expect(403);
    });

    it('should call send a 400 if the password is missing', async () => {
      userService.changePassword.mockResolvedValue(undefined);
      const retrievedUser = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
      };

      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        userAuth: { id: '1', roles: [Role.USER] },
      });
      userService.getUser.mockResolvedValue(retrievedUser);
      await request(await server())
        .put('/users/1/password')
        .expect(400);
    });

    it('should send a 403 if the user is trying to change a password that is not theirs', async () => {
      userService.changePassword.mockRejectedValue(undefined);
      const retrievedUser = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
        firstName: 'foo',
        lastName: 'bar',
      };

      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        userAuth: { id: '2', roles: [Role.USER] },
      });
      userService.getUser.mockResolvedValue(retrievedUser);
      await request(await server())
        .put('/users/1/password')
        .send({ password: 'foobarbaz' })
        .expect(403);
    });
  });
});
