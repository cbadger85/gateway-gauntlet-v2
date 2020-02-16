import OrganizerService from '../../organizers/organizers.service';
import Container from 'typedi';
import AuthService from '../../auth/auth.service';
import { Role } from '../../auth/Role.model';
import request from 'supertest';
import server from '../../server';

class MockOrganizerService {
  getOrganizers = jest.fn();
}

class MockAuthService {
  login = jest.fn();
  refresh = jest.fn();
}

beforeEach(jest.clearAllMocks);

describe('organizers.routes', () => {
  let organizerService: MockOrganizerService;
  let authService: MockAuthService;

  beforeEach(() => {
    Container.set(OrganizerService, new MockOrganizerService());
    Container.set(AuthService, new MockAuthService());
    organizerService = (Container.get(
      OrganizerService,
    ) as unknown) as MockOrganizerService;
    authService = (Container.get(AuthService) as unknown) as MockAuthService;
  });

  describe('GET /organizers', () => {
    it('should call getOrganizers', async () => {
      const retrievedUser1 = {
        id: '1',
        name: 'foo bar',
      };

      const retrievedUser2 = {
        id: '2',
        name: 'foo baz',
      };

      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      organizerService.getOrganizers.mockResolvedValue([
        retrievedUser1,
        retrievedUser2,
      ]);
      const response = await request(await server())
        .get('/organizers')
        .expect(200);

      expect(organizerService.getOrganizers).toBeCalledWith();

      expect(response.body).toEqual([retrievedUser1, retrievedUser2]);
    });

    it('should send a 403 if the user is not authorized', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.USER] },
      });

      await request(await server())
        .get('/organizers')
        .expect(403);
    });
  });
});
