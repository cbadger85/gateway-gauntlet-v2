import request from 'supertest';
import { Container } from 'typedi';
import server from '../../server';
import UserService from '../../users/users.service';
import NotFound from '../../errors/NotFound';
import { Role } from '../../auth/models/Role';
import { ValidationError } from 'class-validator';

class MockService {
  addUser = jest.fn();
  getUser = jest.fn();
}

describe('user.routes', () => {
  let userService: MockService;

  beforeAll(() => {
    Container.set(UserService, new MockService());
    userService = (Container.get(UserService) as unknown) as MockService;
  });
  describe('POST /users', () => {
    it('should call addUser', async () => {
      const savedUser = {
        id: 1,
        username: 'foo',
        roles: [Role.USER],
      };

      const sentUser = {
        username: 'foo',
        password: 'barium12',
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

    it('should return an error if the request body is invalid', async () => {
      userService.addUser.mockRejectedValue(new Error('oops'));
      const response = await request(await server())
        .post('/users')
        .send({ username: 'foo', password: 'bar' })
        .expect(400);

      expect(response.body).toMatchObject({
        errors: expect.arrayContaining([expect.anything()]),
      });
    });
  });

  describe('GET /user', () => {
    it('should call getUser', async () => {
      const retrievedUser = {
        id: 1,
        username: 'foo',
        roles: [Role.USER],
      };
      userService.getUser.mockResolvedValue(retrievedUser);
      const response = await request(await server())
        .get('/users/1')
        .expect(200);

      expect(userService.getUser).toBeCalledWith(1);

      expect(response.body).toEqual(retrievedUser);
    });

    it('should return an error if it failed to save', async () => {
      const notFound = new NotFound('user not found');

      const responseBody = {
        name: notFound.name,
        message: notFound.message,
        statusCode: notFound.statusCode,
      };

      userService.getUser.mockRejectedValue(notFound);
      const response = await request(await server())
        .get('/users/1')
        .expect(404);

      expect(response.body).toEqual(responseBody);
    });
  });
});
