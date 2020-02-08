import userReducer from '../../store/user/userSlice';
import { User, Role } from '../../types/User';
import { loginSuccess, logoutSucess } from '../../store/actions';

jest.mock('../../store');

const initialState: User = {
  firstName: '',
  lastName: '',
  email: '',
  id: '',
  username: '',
  roles: [],
};

const mockUser: User = {
  firstName: 'foo',
  lastName: 'bar',
  email: 'foo@bar.com',
  id: 'abc',
  username: 'foobar',
  roles: [Role.USER],
};

describe('userSlice', () => {
  describe('userReducer', () => {
    it('should return a user when logged in', () => {
      const loggedInUser = userReducer(undefined, {
        type: loginSuccess.type,
        payload: mockUser,
      });

      expect(loggedInUser).toEqual(mockUser);
    });

    it('should return the initial state when logged out', () => {
      const loggedInUser = userReducer(undefined, {
        type: logoutSucess.type,
      });

      expect(loggedInUser).toEqual(initialState);
    });
  });
});
