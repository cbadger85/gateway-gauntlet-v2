import React from 'react';
import { useHasRole } from '../../hooks/useHasRole';
import { getAllUsers } from '../../controllers/usersController';
import { User, Role } from '../../types/User';
import { shallow, mount, ReactWrapper } from 'enzyme';
import Users from '../../pages/Users';
import Button from '@material-ui/core/Button';
import UserCard from '../../components/UserCard';
import { act } from 'react-dom/test-utils';
import AddUserDrawer from '../../components/AddUserDrawer';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('../../controllers/usersController', () => ({
  getAllUsers: jest.fn(),
}));

jest.mock('../../hooks/useHasRole', () => ({
  useHasRole: jest.fn(),
}));

const user1: User = {
  id: '1',
  firstName: 'foo',
  lastName: 'bar',
  name: 'foo bar',
  username: 'foobar',
  email: 'foo@example.com',
  gravatar: 'gravatar',
  sessionId: '123',
  roles: [Role.USER],
};

const user1Updated: User = {
  id: '1',
  firstName: 'foo',
  lastName: 'bar',
  name: 'foo bar',
  username: 'foobar',
  email: 'foo2@example.com',
  gravatar: 'gravatar',
  sessionId: '123',
  roles: [Role.USER],
};

const user2: User = {
  id: '2',
  firstName: 'foo',
  lastName: 'bar',
  name: 'foo bar',
  username: 'foobar',
  email: 'foo@example.com',
  gravatar: 'gravatar',
  sessionId: '123',
  roles: [Role.USER],
};

beforeEach(jest.clearAllMocks);

beforeAll(() => {
  (getAllUsers as jest.Mock).mockResolvedValue([user1]);
});

describe('<Users />', () => {
  it('should show the Add User button if the user is an admin', () => {
    (useHasRole as jest.Mock).mockReturnValue(() => true);
    const wrapper = shallow(<Users />);

    const addUserButton = wrapper.find(Button);

    expect(addUserButton.exists()).toBeTruthy();
  });

  it('should hide the Add User button if the user is not an admin', () => {
    (useHasRole as jest.Mock).mockReturnValue(() => false);
    const wrapper = shallow(<Users />);

    const addUserButton = wrapper.find(Button);

    expect(addUserButton.exists()).toBeFalsy();
  });

  it('should get all users on mount', async () => {
    (useHasRole as jest.Mock).mockReturnValue(() => true);

    let wrapper: ReactWrapper<any, Readonly<{}>>;

    await act(async () => {
      wrapper = mount(<Users />);
    });

    wrapper!.update();
    const userCards = wrapper!.find(UserCard);

    expect(userCards).toHaveLength(1);
  });

  it('should add a user when handleAddUser is called', async () => {
    (useHasRole as jest.Mock).mockReturnValue(() => true);

    const wrapper = shallow(<Users />);

    const handleAddUser = wrapper.find(AddUserDrawer).invoke('onAddUser');

    handleAddUser(user1);

    const userCards = wrapper.find(UserCard);

    expect(userCards).toHaveLength(1);
  });

  it('should update a user when handleUpdateUser is called', async () => {
    (useHasRole as jest.Mock).mockReturnValue(() => true);

    const wrapper = shallow(<Users />);

    const handleAddUser = wrapper.find(AddUserDrawer).invoke('onAddUser');
    handleAddUser(user1);
    handleAddUser(user2);

    const handleUpdateUser = wrapper
      .find(UserCard)
      .findWhere(card => card.props().user.id === user1.id)
      .invoke('updateUser');
    handleUpdateUser(user1Updated);

    const userId = wrapper
      .find(UserCard)
      .findWhere(card => card.props().user.id === user1.id)
      .props().user.email;

    expect(userId).toBe(user1Updated.email);
  });

  it('should open the drawer when the Add User button is clicked', async () => {
    (useHasRole as jest.Mock).mockReturnValue(() => true);

    const wrapper = shallow(<Users />);

    const handleToggleDrawer = wrapper.find(Button).invoke('onClick');

    handleToggleDrawer?.({} as any);

    const isDrawerOpen = wrapper.find(AddUserDrawer).props().isOpen;

    expect(isDrawerOpen).toBeTruthy();
  });

  it('should set the card to edit mode when the edit button is clicked', async () => {
    (useHasRole as jest.Mock).mockReturnValue(() => true);

    const wrapper = shallow(<Users />);

    const handleAddUser = wrapper.find(AddUserDrawer).invoke('onAddUser');
    handleAddUser(user1);

    const setIsEditMode = wrapper.find(UserCard).invoke('setIsEditMode');

    setIsEditMode(user1.id);

    const isEditMode = wrapper.find(UserCard).props().isEditMode;

    expect(isEditMode).toBeTruthy();
  });
});
