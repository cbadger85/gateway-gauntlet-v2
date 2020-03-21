import organizerReducer, {
  loadOrganizers,
  getOrganizerList,
} from '../../store/organizer/organizerSlice';
import configureStore from 'redux-mock-store';
import { getOrganizers } from '../../controllers/organizersController';
import { getDefaultMiddleware } from '@reduxjs/toolkit';

jest.mock('../../store');

jest.mock('../../controllers/organizersController', () => ({
  getOrganizers: jest.fn(),
}));

const mockOrganizerList = [
  {
    id: '1234',
    name: 'foo bar',
    email: 'foo@example.com',
  },
];

const mockStore = configureStore([...getDefaultMiddleware()]);

describe('organizerSlice', () => {
  describe('organizerReducer', () => {
    it('should load a list of organizers', () => {
      const organizers = organizerReducer([], {
        type: loadOrganizers.type,
        payload: mockOrganizerList,
      });

      expect(organizers).toEqual(mockOrganizerList);
    });
  });

  describe('getOrganizerList', () => {
    it('should call getOrganizers', async () => {
      (getOrganizers as jest.Mock).mockResolvedValue(mockOrganizerList);

      const store = mockStore({ organizers: [] });

      await store.dispatch(getOrganizerList() as any);

      expect(getOrganizers).toBeCalledWith();
    });

    it('should dispatch loadOrganizers', async () => {
      (getOrganizers as jest.Mock).mockResolvedValue(mockOrganizerList);

      const store = mockStore({ organizers: [] });

      await store.dispatch(getOrganizerList() as any);

      const loadOrganizersAction = {
        type: loadOrganizers.type,
        payload: mockOrganizerList,
      };

      expect(store.getActions()).toEqual([loadOrganizersAction]);
    });
  });
});
