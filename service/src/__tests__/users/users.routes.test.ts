import request from 'supertest';
import { Container } from 'typedi';
import server from '../../server';
import UserService from '../../users/users.service';

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
      userService.addUser.mockResolvedValue({
        id: 1,
        username: 'foo',
        password: 'bar',
      });
      const response = await request(await server())
        .post('/users')
        .send({ username: 'foo', password: 'bar' })
        .expect(200);

      expect(userService.addUser).toBeCalledWith({
        username: 'foo',
        password: 'bar',
      });

      expect(response.body).toEqual({
        id: 1,
        username: 'foo',
        password: 'bar',
      });
    });

    it('should return an error if it failed to save', async () => {
      userService.addUser.mockRejectedValue(new Error('oops'));
      await request(await server())
        .post('/users')
        .send({ username: 'foo', password: 'bar ' })
        .expect(500);
    });
  });

  describe('GET /user', () => {
    it('should call addUser', async () => {
      userService.getUser.mockResolvedValue({
        id: 1,
        username: 'foo',
        password: 'baz',
      });
      const response = await request(await server())
        .get('/users/1')
        .expect(200);

      expect(userService.getUser).toBeCalledWith(1);

      expect(response.body).toEqual({
        id: 1,
        username: 'foo',
        password: 'baz',
      });
    });

    it('should return an error if it failed to save', async () => {
      userService.getUser.mockRejectedValue(new Error('oops'));
      await request(await server())
        .get('/users/1')
        .expect(500);
    });
  });
});
