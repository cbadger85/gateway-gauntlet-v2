import { Repository } from 'typeorm';
import OrganizerService from '../../organizers/organizers.service';

import User from '../../users/users.entity';
import UserRepository from '../../users/users.repository';

class MockRepository {
  private repository: Repository<User>;
  findOrganizers = jest.fn();
}

beforeEach(jest.clearAllMocks);

describe('OrganizerService', () => {
  const mockUserRepository = (new MockRepository() as unknown) as UserRepository;
  const organizerService = new OrganizerService(mockUserRepository);

  describe('getOrganizers', () => {
    it('should call repository.findOrganizers', async () => {
      (mockUserRepository.findOrganizers as jest.Mock).mockResolvedValue([]);

      await organizerService.getOrganizers();

      expect(mockUserRepository.findOrganizers).toBeCalledWith();
    });

    it('should return a list of organizers', async () => {
      (mockUserRepository.findOrganizers as jest.Mock).mockResolvedValue([
        {
          id: '1',
          firstName: 'foo',
          lastName: 'bar',
        },
        {
          id: '2',
          firstName: 'foo',
          lastName: 'baz',
        },
      ]);

      const organizers = await organizerService.getOrganizers();

      const expectedOrganizers = [
        {
          id: '1',
          name: 'foo bar',
        },
        {
          id: '2',
          name: 'foo baz',
        },
      ];

      expect(organizers).toEqual(expectedOrganizers);
    });
  });
});
