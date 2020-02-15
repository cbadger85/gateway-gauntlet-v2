import userReducer from '../../store/user/userSlice';
import { User, Role } from '../../types/User';
import { loginSuccess, logoutSucess } from '../../store/actions';

jest.mock('../../store');

const initialState: User = {
  firstName: '',
  lastName: '',
  name: '',
  gravatar: 'https://www.gravatar.com/avatar?s=200&d=mp&f=y',
  email: '',
  id: '',
  username: '',
  roles: [],
  sessionId: '',
};

const mockUser: User = {
  firstName: 'foo',
  lastName: 'bar',
  name: 'foo bar',
  gravatar: '/333',
  email: 'foo@bar.com',
  id: 'abc',
  username: 'foobar',
  roles: [Role.USER],
  sessionId: '1234',
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
