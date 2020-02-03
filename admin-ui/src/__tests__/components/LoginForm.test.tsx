import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import LoginForm from '../../components/LoginForm';

describe('<LoginForm />', () => {
  it('should call login when the form is submitted', async () => {
    const login = jest.fn();
    const { getByTestId } = render(<LoginForm login={login} />);

    const usernameInput = getByTestId('username-input').querySelector('input');
    const passwordInput = getByTestId('password-input').querySelector('input');

    await act(async () => {
      fireEvent.change(usernameInput as Element, {
        target: { value: 'foo' },
      });
    });

    await act(async () => {
      fireEvent.change(passwordInput as Element, {
        target: { value: 'bar' },
      });
    });

    await act(async () => {
      fireEvent.submit(getByTestId('login-form') as Element);
    });

    expect(login).toBeCalled();
  });

  it('should not call login when the form is invalid', async () => {
    const login = jest.fn();
    const { getByTestId } = render(<LoginForm login={login} />);

    await act(async () => {
      fireEvent.submit(getByTestId('login-form') as Element);
    });

    expect(login).not.toBeCalled();
  });
});
