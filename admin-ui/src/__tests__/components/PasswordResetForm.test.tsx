import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import PasswordResetForm from '../../components/PasswordResetForm';

describe('<LoginForm />', () => {
  it('should call login when the form is submitted', async () => {
    const submitPasswordReset = jest.fn();
    const { getByTestId } = render(
      <PasswordResetForm submitPasswordReset={submitPasswordReset} />,
    );

    const passwordInput = getByTestId('password-input').querySelector('input');
    const confirmPasswordInput = getByTestId(
      'confirm-password-input',
    ).querySelector('input');

    await act(async () => {
      fireEvent.change(passwordInput as Element, {
        target: { value: '12345678' },
      });
    });

    await act(async () => {
      fireEvent.change(confirmPasswordInput as Element, {
        target: { value: '12345678' },
      });
    });

    await act(async () => {
      fireEvent.submit(getByTestId('password-reset-form') as Element);
    });

    expect(submitPasswordReset).toBeCalled();
  });

  it('should not call login when the form is invalid', async () => {
    const submitPasswordReset = jest.fn();
    const { getByTestId } = render(
      <PasswordResetForm submitPasswordReset={submitPasswordReset} />,
    );

    await act(async () => {
      fireEvent.submit(getByTestId('password-reset-form') as Element);
    });

    expect(submitPasswordReset).not.toBeCalled();
  });
});
