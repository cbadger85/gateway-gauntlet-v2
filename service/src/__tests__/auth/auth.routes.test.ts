import Container from 'typedi';
import AuthService from '../../auth/auth.service';
import { Role } from '../../auth/models/Role';
import request from 'supertest';
import server from '../../server';
import NotAuthorized from '../../errors/NotAuthorized';

class MockService {
  login = jest.fn();
  logout = jest.fn();
  refresh = jest.fn();
  requestResetPassword = jest.fn();
}

describe('auth.routes', () => {
  let authService: MockService;

  beforeAll(() => {
    Container.set(AuthService, new MockService());
    authService = (Container.get(AuthService) as unknown) as MockService;
  });

  describe('POST auth/login', () => {
    it('should return a user and tokens', async () => {
      const loginRequest = { username: 'foo', password: 'bar' };
      const user = {
        username: 'foo',
        email: 'foo@example.com',
        roles: [Role.USER],
      };

      const accessToken = 'access_token';
      const refreshToken = 'refresh_token';

      authService.login.mockResolvedValue({ user, accessToken, refreshToken });

      const response = await request(await server())
        .post('/auth/login')
        .send(loginRequest)
        .expect(200);

      expect(response.body).toEqual(user);
      expect(response.header['set-cookie']).toEqual(
        expect.arrayContaining([
          expect.stringContaining('access-token=access_token;'),
          expect.stringContaining('refresh-token=refresh_token;'),
        ]),
      );
    });

    it('should return a 400 if the login request is invalid', async () => {
      const loginRequest = { username: 'foo' };

      const response = await request(await server())
        .post('/auth/login')
        .send(loginRequest)
        .expect(400);

      expect(response.body.errors).toHaveLength(1);
    });

    it('should return a 401 if the user is not authorized', async () => {
      const loginRequest = { username: 'foo', password: 'bar' };

      authService.login.mockRejectedValue(new NotAuthorized());

      const response = await request(await server())
        .post('/auth/login')
        .send(loginRequest)
        .expect(401);

      const { message, name, statusCode } = new NotAuthorized();
      const errorBody = {
        message,
        name,
        statusCode,
      };

      expect(response.body).toEqual(errorBody);
      expect(response.header['set-cookie']).toBe(undefined);
    });
  });

  describe('POST auth/logout', () => {
    it('should send a 204 and no cookies', async () => {
      const response = await request(await server())
        .post('/auth/logout')
        .set('Cookie', 'access-token=access_token; refresh-token=refresh_token')
        .expect(204);

      expect(response.header['set-cookie']).toEqual(
        expect.arrayContaining([
          expect.stringContaining('access-token=;'),
          expect.stringContaining('refresh-token=;'),
        ]),
      );
    });
  });

  describe('POST auth/password/reset', () => {
    it('should call resetPassword', async () => {
      authService.requestResetPassword.mockResolvedValue(void 0);

      await request(await server())
        .post('/auth/password/reset')
        .send({ email: 'foo@example.com' })
        .expect(204);

      expect(authService.requestResetPassword).toBeCalledWith(
        'foo@example.com',
      );
    });

    it('should send a  400 if there is no email address sent', async () => {
      authService.requestResetPassword.mockResolvedValue(void 0);

      await request(await server())
        .post('/auth/password/reset')
        .expect(400);
    });
  });

  describe('GET auth/token', () => {
    it('should return the user from the request object', async () => {
      const user = { id: '1', roles: [Role.USER] };
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user,
      });

      const response = await request(await server())
        .get('/auth/token')
        .expect(200);

      expect(response.body).toEqual(user);
    });
  });
});
