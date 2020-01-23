import request from 'supertest';
import { Container } from 'typedi';
import server from '../../server';
import UserService from '../../users/users.service';
import NotFound from '../../errors/NotFound';
import { Role } from '../../auth/models/Role';
import BadRequest from '../../errors/BadRequest';
import AuthService from '../../auth/auth.service';

class MockService {
  addUser = jest.fn();
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
        password: 'barium12',
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

      expect(response.body.errors).toHaveLength(3);
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
        password: 'barium12',
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

  describe('GET /user', () => {
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
