import Typography from '@material-ui/core/Typography';
import { shallow } from 'enzyme';
import React from 'react';
import { useHistory } from 'react-router-dom';
import PasswordResetForm from '../../components/PasswordResetForm';
import { postResetPassword } from '../../controllers/usersController';
import { useQuery } from '../../hooks/useQuery';
import PasswordReset from '../../pages/PasswordReset';
import { addSnackbar } from '../../store/alert/alertSlice';

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn().mockReturnValue({ push: jest.fn() }),
  useParams: jest.fn().mockReturnValue({
    userId: 'aaa',
    passwordResetId: 'bbb',
  }),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('../../hooks/useQuery', () => ({
  useQuery: jest.fn(),
}));

jest.mock('../../controllers/usersController', () => ({
  postResetPassword: jest.fn(),
}));

jest.mock('../../store/alert/alertSlice', () => ({
  addSnackbar: jest.fn(),
}));

beforeEach(jest.clearAllMocks);

describe('<PasswordReset />', () => {
  it('should show `Set Password` if the query param is set', () => {
    (useQuery as jest.Mock).mockReturnValueOnce({ get: () => 'true' });

    const wrapper = shallow(<PasswordReset />);
    const header = wrapper
      .find(Typography)
      .findWhere(component => component.props().component === 'h1')
      .text();

    expect(header).toBe('Set Password');
  });

  it('should show `Reset Password` if the query param is not set', () => {
    (useQuery as jest.Mock).mockReturnValueOnce({ get: () => '' });

    const wrapper = shallow(<PasswordReset />);
    const header = wrapper
      .find(Typography)
      .findWhere(component => component.props().component === 'h1')
      .text();

    expect(header).toBe('Reset Password');
  });

  it('should call postResetPassword if the form is submitted', async () => {
    (useQuery as jest.Mock).mockReturnValueOnce({ get: () => 'true' });
    (postResetPassword as jest.Mock).mockResolvedValue(undefined);

    const wrapper = shallow(<PasswordReset />);
    const handleSubmitPasswordReset = wrapper
      .find(PasswordResetForm)
      .invoke('submitPasswordReset');

    await handleSubmitPasswordReset({ password: '1111' } as any);

    expect(postResetPassword).toBeCalledWith('aaa', 'bbb', '1111');
  });

  it('should dispatch addSnackbar if the form is submitted successfully', async () => {
    (useQuery as jest.Mock).mockReturnValueOnce({ get: () => 'true' });
    (postResetPassword as jest.Mock).mockResolvedValue(undefined);

    const wrapper = shallow(<PasswordReset />);
    const handleSubmitPasswordReset = wrapper
      .find(PasswordResetForm)
      .invoke('submitPasswordReset');

    await handleSubmitPasswordReset({ password: '1111' } as any);

    expect(addSnackbar).toBeCalledWith(expect.any(String));
  });

  it('should call history.push if the form is submitted successfully', async () => {
    (useQuery as jest.Mock).mockReturnValueOnce({ get: () => 'true' });
    (postResetPassword as jest.Mock).mockResolvedValue(undefined);

    const wrapper = shallow(<PasswordReset />);
    const handleSubmitPasswordReset = wrapper
      .find(PasswordResetForm)
      .invoke('submitPasswordReset');

    await handleSubmitPasswordReset({ password: '1111' } as any);

    expect(useHistory().push).toBeCalledWith('/login');
  });

  it('should dispatch addSnackbar if the new user form is not submitted successfully', async () => {
    (useQuery as jest.Mock).mockReturnValueOnce({ get: () => 'true' });
    (postResetPassword as jest.Mock).mockRejectedValue(undefined);

    const wrapper = shallow(<PasswordReset />);
    const handleSubmitPasswordReset = wrapper
      .find(PasswordResetForm)
      .invoke('submitPasswordReset');

    try {
      await handleSubmitPasswordReset({ password: '1111' } as any);
    } catch {
      expect(addSnackbar).toBeCalledWith('Failed to set password', 'error');
    }
  });

  it('should dispatch addSnackbar if the reset password form is not submitted successfully', async () => {
    (useQuery as jest.Mock).mockReturnValueOnce({ get: () => '' });
    (postResetPassword as jest.Mock).mockRejectedValue(undefined);

    const wrapper = shallow(<PasswordReset />);
    const handleSubmitPasswordReset = wrapper
      .find(PasswordResetForm)
      .invoke('submitPasswordReset');

    try {
      await handleSubmitPasswordReset({ password: '1111' } as any);
    } catch {
      expect(addSnackbar).toBeCalledWith('Failed to reset password', 'error');
    }
  });
});
