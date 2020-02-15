import React from 'react';
import { User, Role } from '../../types/User';
import { shallow } from 'enzyme';
import AddUserDrawer from '../../components/AddUserDrawer';
import { postUser } from '../../controllers/usersController';
import UpsertUserForm from '../../components/UpsertUserForm';
import { addSnackbar } from '../../store/alert/alertSlice';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('../../controllers/usersController', () => ({
  postUser: jest.fn(),
}));

jest.mock('../../store/alert/alertSlice', () => ({
  addSnackbar: jest.fn(),
}));

const user: User = {
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

const fieldData = {
  firstName: 'foo',
  lastName: 'bar',
  roles: [Role.USER],
  username: 'foobar',
  email: 'foo@example.com',
};

describe('<AddUserDrawer />', () => {
  it('should call handleAddUser', async () => {
    (postUser as jest.Mock).mockResolvedValue(user);

    const closeDrawer = jest.fn();
    const onAddUser = jest.fn();
    const wrapper = shallow(
      <AddUserDrawer closeDrawer={closeDrawer} onAddUser={onAddUser} />,
    );

    const handleAddUser = wrapper.find(UpsertUserForm).invoke('save');

    await handleAddUser(fieldData);

    expect(postUser).toBeCalledWith(fieldData);
    expect(onAddUser).toBeCalledWith(user);
    expect(closeDrawer).toBeCalledWith();
    expect(addSnackbar).toBeCalled();
  });

  it('should call handleAddUser', async () => {
    (postUser as jest.Mock).mockRejectedValue(new Error());

    const closeDrawer = jest.fn();
    const onAddUser = jest.fn();
    const wrapper = shallow(
      <AddUserDrawer closeDrawer={closeDrawer} onAddUser={onAddUser} />,
    );

    const handleAddUser = wrapper.find(UpsertUserForm).invoke('save');

    await handleAddUser(fieldData);

    const errorMessage = wrapper.find(UpsertUserForm).props().errorMessage;

    expect(errorMessage).toBeTruthy();
  });
});
