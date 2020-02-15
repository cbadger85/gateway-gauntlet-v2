import React from 'react';
import { User, Role } from '../../types/User';
import { putUser } from '../../controllers/usersController';
import { addSnackbar } from '../../store/alert/alertSlice';
import UserCardEditMode from '../../components/UserCardEditMode';
import { shallow } from 'enzyme';
import UpsertUserForm from '../../components/UpsertUserForm';
import IconButton from '@material-ui/core/IconButton';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('../../controllers/usersController', () => ({
  putUser: jest.fn(),
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

describe('<UserCardEditMode />', () => {
  it('should update the user', async () => {
    (putUser as jest.Mock).mockResolvedValue(user);

    const updateUser = jest.fn();
    const clearIsEditMode = jest.fn();
    const wrapper = shallow(
      <UserCardEditMode
        user={user}
        updateUser={updateUser}
        clearIsEditMode={clearIsEditMode}
      />,
    );

    const handleUpdateUser = wrapper.find(UpsertUserForm).invoke('save');

    await handleUpdateUser(fieldData);

    expect(putUser).toBeCalledWith(user.id, fieldData);
    expect(updateUser).toBeCalledWith(user);
    expect(clearIsEditMode).toBeCalledWith();
    expect(addSnackbar).toBeCalled();
  });

  it('should close the form', () => {
    (putUser as jest.Mock).mockResolvedValue(user);

    const updateUser = jest.fn();
    const clearIsEditMode = jest.fn();
    const wrapper = shallow(
      <UserCardEditMode
        user={user}
        updateUser={updateUser}
        clearIsEditMode={clearIsEditMode}
      />,
    );

    const handleClearIsEditMode = wrapper.find(IconButton).invoke('onClick');

    handleClearIsEditMode?.({} as any);

    expect(clearIsEditMode).toBeCalledWith();
  });

  it('show an error message if the update fails', async () => {
    (putUser as jest.Mock).mockRejectedValue(new Error());

    const updateUser = jest.fn();
    const clearIsEditMode = jest.fn();
    const wrapper = shallow(
      <UserCardEditMode
        user={user}
        updateUser={updateUser}
        clearIsEditMode={clearIsEditMode}
      />,
    );

    const handleUpdateUser = wrapper.find(UpsertUserForm).invoke('save');

    await handleUpdateUser(fieldData);

    const errorMessage = wrapper.find(UpsertUserForm).props().errorMessage;

    expect(errorMessage).toBeTruthy();
  });
});
