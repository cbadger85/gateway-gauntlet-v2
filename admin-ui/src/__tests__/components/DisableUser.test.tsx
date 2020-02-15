import React from 'react';
import {
  postDisableUser,
  postEnableUser,
} from '../../controllers/usersController';
import { addSnackbar } from '../../store/alert/alertSlice';
import { User, Role } from '../../types/User';
import { shallow } from 'enzyme';
import DisableUser from '../../components/DisableUser';
import Button from '@material-ui/core/Button';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('../../controllers/usersController', () => ({
  postDisableUser: jest.fn(),
  postEnableUser: jest.fn(),
}));

jest.mock('../../store/alert/alertSlice', () => ({
  addSnackbar: jest.fn(),
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

const user2: User = {
  id: '1',
  firstName: 'foo',
  lastName: 'bar',
  name: 'foo bar',
  username: 'foobar',
  email: 'foo@example.com',
  gravatar: 'gravatar',
  roles: [Role.USER],
};

describe('<DisableUser />', () => {
  it('should call handleEnableUser when the "Enable User" button is clicked', async () => {
    (postEnableUser as jest.Mock).mockResolvedValue(undefined);

    const onClick = jest.fn();
    const updateUser = jest.fn();
    const wrapper = shallow(
      <DisableUser user={user2} onClick={onClick} updateUser={updateUser} />,
    );

    const handleEnableUser = wrapper.find(Button).invoke('onClick');

    await handleEnableUser?.({} as any);

    expect(postEnableUser).toBeCalledWith('1');
    expect(updateUser).toBeCalledWith({ ...user2, sessionId: 'enabled' });
    expect(onClick).toBeCalledWith();
    expect(addSnackbar).toBeCalled();
  });

  it('should call dispatch a toast if handleEnableUser fails', async () => {
    (postEnableUser as jest.Mock).mockRejectedValue(undefined);

    const onClick = jest.fn();
    const updateUser = jest.fn();
    const wrapper = shallow(
      <DisableUser user={user2} onClick={onClick} updateUser={updateUser} />,
    );

    const handleEnableUser = wrapper.find(Button).invoke('onClick');

    await handleEnableUser?.({} as any);

    expect(addSnackbar).toBeCalled();
  });

  it('should call handleEnableUser when the "Enable User" button is clicked', async () => {
    (postDisableUser as jest.Mock).mockResolvedValue(undefined);

    const onClick = jest.fn();
    const updateUser = jest.fn();
    const wrapper = shallow(
      <DisableUser user={user1} onClick={onClick} updateUser={updateUser} />,
    );

    const handleEnableUser = wrapper.find(Button).invoke('onClick');

    await handleEnableUser?.({} as any);

    expect(postDisableUser).toBeCalledWith('1');
    expect(updateUser).toBeCalledWith({ ...user1, sessionId: undefined });
    expect(onClick).toBeCalledWith();
    expect(addSnackbar).toBeCalled();
  });

  it('should call dispatch a toast if handleEnableUser fails', async () => {
    (postDisableUser as jest.Mock).mockRejectedValue(undefined);

    const onClick = jest.fn();
    const updateUser = jest.fn();
    const wrapper = shallow(
      <DisableUser user={user1} onClick={onClick} updateUser={updateUser} />,
    );

    const handleEnableUser = wrapper.find(Button).invoke('onClick');

    await handleEnableUser?.({} as any);

    expect(addSnackbar).toBeCalled();
  });
});
