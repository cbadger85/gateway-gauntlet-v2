import { mount, shallow } from 'enzyme';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Login from '../../pages/Login';
import { checkToken, login } from '../../store/auth/authSlice';
import { Auth } from '../../types/Auth';
import { useLoaderDelay } from '../../hooks/useLoaderDelay';
import LoginForm from '../../components/LoginForm';
import ForgotPasswordModal from '../../components/ForgotPasswordModal';
import { postRequestResetPassword } from '../../controllers/authController';
import { addSnackbar } from '../../store/alert/alertSlice';
import Button from '@material-ui/core/Button';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('../../hooks/useHasRole.ts', () => ({
  useHasRole: jest.fn(),
}));

jest.mock('../../hooks/useLoaderDelay.ts', () => ({
  useLoaderDelay: jest.fn(),
}));

jest.mock('../../store/auth/authSlice.ts', () => ({
  checkToken: jest.fn(),
  login: jest.fn(),
}));

jest.mock('../../store/alert/alertSlice.ts', () => ({
  addSnackbar: jest.fn(),
}));

jest.mock('../../controllers/authController.ts', () => ({
  postRequestResetPassword: jest.fn(),
}));

beforeEach(jest.clearAllMocks);

describe('<ProtectedRoute />', () => {
  it('should dispatch the checkToken action if the user is logged out', () => {
    (useSelector as jest.Mock).mockReturnValue(Auth.LOGGED_OUT);

    const wrapper = mount(<Login />);

    expect(checkToken).toBeCalled();
    wrapper.unmount();
  });

  it('should redirect to `/` if ther user is logged in', () => {
    (useSelector as jest.Mock).mockReturnValue(Auth.LOGGED_IN);

    const wrapper = shallow(<Login />);

    const redirect = wrapper.find(Redirect);

    expect(redirect.exists()).toBeTruthy();
  });

  it('should not show anything if loading is true and checking token is true', () => {
    (useSelector as jest.Mock).mockReturnValue(Auth.LOADING);
    (useLoaderDelay as jest.Mock).mockReturnValue(false);

    const wrapper = shallow(<Login />);

    expect(wrapper.text()).toBeFalsy();
  });

  it('should the loader if loading is true and checking token is true', () => {
    (useSelector as jest.Mock).mockReturnValue(Auth.LOADING);
    (useLoaderDelay as jest.Mock).mockReturnValue(true);

    const wrapper = shallow(<Login />);

    expect(wrapper.text()).toBe('Loading...');
  });

  it('should dispatch login when the login form is submitted', () => {
    (useSelector as jest.Mock).mockReturnValue(Auth.LOGIN_FAILURE);

    const wrapper = shallow(<Login />);

    const handleLogin = wrapper.find(LoginForm).invoke('login');

    handleLogin({ username: 'foo', password: 'bar' });

    expect(login).toBeCalledWith('foo', 'bar');
  });

  it('should call postRequestResetPassword and dispatch addSnackbar when the password change request is sent', async () => {
    (postRequestResetPassword as jest.Mock).mockResolvedValue(undefined);
    (useSelector as jest.Mock).mockReturnValue(Auth.LOGIN_FAILURE);

    const wrapper = shallow(<Login />);

    const handleSubmitForgotPassword = wrapper
      .find(ForgotPasswordModal)
      .invoke('submitForgotPassword');

    await handleSubmitForgotPassword({ email: 'foo@example.com' });

    expect(postRequestResetPassword).toBeCalledWith('foo@example.com');
    expect(addSnackbar).toBeCalled();
  });

  it('should call postRequestResetPassword and dispatch addSnackbar if the email failed to send', async () => {
    (postRequestResetPassword as jest.Mock).mockRejectedValue(undefined);
    (useSelector as jest.Mock).mockReturnValue(Auth.LOGIN_FAILURE);

    const wrapper = shallow(<Login />);

    const handleSubmitForgotPassword = wrapper
      .find(ForgotPasswordModal)
      .invoke('submitForgotPassword');

    await handleSubmitForgotPassword({ email: 'foo@example.com' });

    expect(postRequestResetPassword).toBeCalledWith('foo@example.com');
    expect(addSnackbar).toBeCalled();
  });

  it('should close the modal when postRequestResetPassword is called', async () => {
    (useSelector as jest.Mock).mockReturnValue(Auth.LOGIN_FAILURE);

    const wrapper = shallow(<Login />);

    const handleSubmitForgotPassword = wrapper
      .find(ForgotPasswordModal)
      .invoke('submitForgotPassword');

    await handleSubmitForgotPassword({ email: 'foo@example.com' });

    const isModalOpen = wrapper.find(ForgotPasswordModal).props().isOpen;

    expect(isModalOpen).toBeFalsy();
  });

  it('should show the modal when the `forgot password` button is clicked', () => {
    (useSelector as jest.Mock).mockReturnValue(Auth.LOGIN_FAILURE);

    const wrapper = shallow(<Login />);

    const forgotPasswordButton = wrapper.find(Button);

    const openForgotPasswordModal = forgotPasswordButton.invoke('onClick');

    openForgotPasswordModal?.({} as any);

    const isModalOpen = wrapper.find(ForgotPasswordModal).props().isOpen;

    expect(isModalOpen).toBeTruthy();
  });

  it('should close the modal closeModal is called', () => {
    (useSelector as jest.Mock).mockReturnValue(Auth.LOGIN_FAILURE);

    const wrapper = shallow(<Login />);

    const forgotPasswordButton = wrapper.find(Button);

    const openForgotPasswordModal = forgotPasswordButton.invoke('onClick');

    openForgotPasswordModal?.({} as any);

    const closeForgotPasswordModal = wrapper
      .find(ForgotPasswordModal)
      .invoke('closeModal');

    closeForgotPasswordModal();

    const isModalOpen = wrapper.find(ForgotPasswordModal).props().isOpen;

    expect(isModalOpen).toBeFalsy();
  });
});
