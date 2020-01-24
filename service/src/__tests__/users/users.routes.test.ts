import request from 'supertest';
import { Container } from 'typedi';
import server from '../../server';
import UserService from '../../users/users.service';
import NotFound from '../../errors/NotFound';
import { Role } from '../../auth/models/Role';
import BadRequest from '../../errors/BadRequest';
import AuthService from '../../auth/auth.service';
import Forbidden from '../../errors/Forbidden';
import NotAuthorized from '../../errors/NotAuthorized';

class MockService {
  addUser = jest.fn();
  requestResetPassword = jest.fn();
  disableAccount = jest.fn();
  resetPassword = jest.fn();
  getUser = jest.fn();
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
      const savedUser = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
      };

      const sentUser = {
        username: 'foo',
        email: 'email@example.com',
        roles: ['USER'],
      };

      userService.addUser.mockResolvedValue(savedUser);
      const response = await request(await server())
        .post('/users')
        .send(sentUser)
        .expect(200);

      expect(userService.addUser).toBeCalledWith(sentUser);

      expect(response.body).toEqual(savedUser);
    });

    it('should send a BadRequest if the request body is invalid', async () => {
      const response = await request(await server())
        .post('/users')
        .send({ username: 'foo', password: 'bar' })
        .expect(400);

      expect(response.body.errors).toHaveLength(2);
    });

    it('should send a BadRequest if the user already exists', async () => {
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
      };

      const response = await request(await server())
        .post('/users')
        .send(sentUser)
        .expect(400);

      expect(response.body).toEqual(responseBody);
    });
  });

  describe('PUT /users/:id/disable', () => {
    it('should call disableAccount', async () => {
      const retrievedUser = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
      };

      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        userAuth: { id: '2', roles: [Role.ADMIN] },
      });

      userService.getUser.mockResolvedValue(retrievedUser);

      userService.disableAccount.mockResolvedValue(undefined);

      await request(await server())
        .put('/users/1/disable')
        .expect(204);

      expect(userService.disableAccount).toBeCalledWith('1');
    });

    it('should return a 403 if the user is not authorized', async () => {
      const retrievedUser = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.ADMIN],
      };

      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        userAuth: { id: '2', roles: [Role.ADMIN] },
      });

      userService.getUser.mockResolvedValue(retrievedUser);

      userService.disableAccount.mockResolvedValue(undefined);

      await request(await server())
        .put('/users/1/disable')
        .expect(403);

      expect(userService.disableAccount).not.toBeCalled();
    });

    it('should return a 404 if the user cannot be found', async () => {
      const retrievedUser = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
      };

      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        userAuth: { id: '2', roles: [Role.ADMIN] },
      });

      userService.getUser.mockResolvedValueOnce(retrievedUser);
      userService.disableAccount.mockRejectedValue(new NotFound('not found'));

      await request(await server())
        .put('/users/1/disable')
        .expect(404);
    });
  });

  describe('PUT /:id/reset', () => {
    it('should call resetPassword', async () => {
      userService.resetPassword.mockResolvedValue(undefined);

      await request(await server())
        .put('/users/1/reset')
        .send({ password: 'foobarbaz' })
        .expect(204);

      expect(userService.resetPassword).toBeCalledWith('1', 'foobarbaz');
    });

    it('should call send a 400 if the password is missing', async () => {
      userService.resetPassword.mockResolvedValue(undefined);

      await request(await server())
        .put('/users/1/reset')
        .expect(400);
    });

    it('should send a  403 if resetPassword throws a NotAuthorized', async () => {
      userService.resetPassword.mockRejectedValue(new Forbidden());

      await request(await server())
        .put('/users/1/reset')
        .send({ password: 'foobarbaz' })
        .expect(403);
    });
  });

  describe('PUT /:id/request-reset', () => {
    it('should call resetPassword', async () => {
      userService.requestResetPassword.mockResolvedValue(void 0);

      await request(await server())
        .put('/users/1/request-reset')
        .send({ email: 'foo@example.com' })
        .expect(204);

      expect(userService.requestResetPassword).toBeCalledWith(
        'foo@example.com',
      );
    });

    it('should send a  400 if there is no email sent', async () => {
      userService.resetPassword.mockResolvedValue(void 0);

      await request(await server())
        .put('/users/1/request-reset')
        .expect(400);
    });
  });

  describe('GET /users/:id', () => {
    it('should call getUser', async () => {
      const retrievedUser = {
        id: '1',
        username: 'foo',
        email: 'email@example.com',
        roles: [Role.USER],
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
});
