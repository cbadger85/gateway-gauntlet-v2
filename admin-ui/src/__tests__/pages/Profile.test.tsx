import React from 'react';
import { User, Role } from '../../types/User';
import { useSelector } from 'react-redux';
import { shallow } from 'enzyme';
import Profile from '../../pages/Profile';
import Button from '@material-ui/core/Button';
import PasswordResetForm from '../../components/PasswordResetForm';
import { addSnackbar } from '../../store/alert/alertSlice';
import { putChangePassword } from '../../controllers/usersController';
import useMediaQuery from '@material-ui/core/useMediaQuery';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
  useSelector: jest.fn(),
}));

jest.mock('../../controllers/usersController', () => ({
  putChangePassword: jest.fn(),
}));

jest.mock('../../store/alert/alertSlice.ts', () => ({
  addSnackbar: jest.fn(),
}));

jest.mock('@material-ui/core/useMediaQuery', () => jest.fn());

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

beforeAll(() => {
  (useSelector as jest.Mock).mockReturnValue(user);
});

beforeEach(jest.clearAllMocks);

describe('<Profile />', () => {
  it('should show the password reset form when the channge password button is clicked', () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true);

    const wrapper = shallow(<Profile />);

    wrapper.find(Button).simulate('click');

    const form = wrapper.find(PasswordResetForm);

    expect(form.exists()).toBeTruthy();
  });

  it('should call putChangePassword when the form is submitted', async () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false);

    (putChangePassword as jest.Mock).mockResolvedValue(undefined);

    const wrapper = shallow(<Profile />);

    wrapper.find(Button).simulate('click');

    const handleChangePassword = wrapper
      .find(PasswordResetForm)
      .invoke('submitPasswordReset');

    await handleChangePassword({ password: 'foo' } as any);

    expect(putChangePassword).toBeCalledWith(user.id, 'foo');
    expect(addSnackbar).toBeCalled();
  });

  it('should call putChangePassword when the form is submitted', async () => {
    (putChangePassword as jest.Mock).mockRejectedValue(undefined);

    const wrapper = shallow(<Profile />);

    wrapper.find(Button).simulate('click');

    const handleChangePassword = wrapper
      .find(PasswordResetForm)
      .invoke('submitPasswordReset');

    await handleChangePassword({ password: 'foo' } as any);

    expect(putChangePassword).toBeCalledWith(user.id, 'foo');
    expect(addSnackbar).toBeCalled();
  });
});
