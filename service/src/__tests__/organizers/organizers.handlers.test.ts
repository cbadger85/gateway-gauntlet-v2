import Container from 'typedi';
import { Role } from '../../auth/Role.model';
import { getOrganizers } from '../../organizers/organizers.handlers';
import OrganizerService from '../../organizers/organizers.service';

const mockUser = {
  username: 'foo',
  password: 'bar',
  sessionId: '5678',
  email: 'foo@example.com',
  roles: [Role.USER],
};

class MockOrganizerService {
  getOrganizers = jest.fn();
}

const mockRes = {
  json: jest.fn().mockReturnThis(),
  sendStatus: jest.fn().mockReturnThis(),
};

beforeEach(jest.clearAllMocks);

describe('organizers.handlers', () => {
  let organizerService: MockOrganizerService;

  beforeAll(() => {
    Container.set(OrganizerService, new MockOrganizerService());
    organizerService = (Container.get(
      OrganizerService,
    ) as unknown) as MockOrganizerService;
  });

  describe('getOrganizers', () => {
    it('should call userService.getOrganizers', async () => {
      await getOrganizers({} as any, mockRes as any, jest.fn());

      expect(organizerService.getOrganizers).toBeCalledWith();
    });

    it('should res.json with the users', async () => {
      organizerService.getOrganizers.mockResolvedValue([mockUser]);
      await getOrganizers({} as any, mockRes as any, jest.fn());

      expect(mockRes.json).toBeCalledWith([mockUser]);
    });
  });
});
