import axios from '../../controllers/axios';
import { getOrganizers } from '../../controllers/organizersController';

jest.mock('../../controllers/axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
}));

beforeEach(jest.clearAllMocks);

describe('organizersController', () => {
  describe('getOrganizers', () => {
    it('should call axios with the url', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: ['organizer'] });

      await getOrganizers();

      const url = `${process.env.REACT_APP_BASE_URL}/organizers`;

      expect(axios.get).toBeCalledWith(url);
    });
  });
});
