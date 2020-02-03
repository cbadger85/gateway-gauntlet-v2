import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import ForgotPasswordModal from '../../components/ForgotPasswordModal';

describe('<ForgotPasswordModal />', () => {
  it('should call submitForgotPassword when the form is submitted', async () => {
    const closeModal = jest.fn();
    const submitForgotPassword = jest.fn();
    const { getByTestId } = render(
      <ForgotPasswordModal
        closeModal={closeModal}
        submitForgotPassword={submitForgotPassword}
        isOpen
      />,
    );

    const input = getByTestId('email-input').querySelector('input');

    await act(async () => {
      fireEvent.change(input as Element, {
        target: { value: 'email@example.com' },
      });
    });

    await act(async () => {
      fireEvent.submit(getByTestId('forgot-password-form') as Element);
    });

    expect(submitForgotPassword).toBeCalled();
  });

  it('should not call submitForgotPassword when the form is invalid', async () => {
    const closeModal = jest.fn();
    const submitForgotPassword = jest.fn();

    const { getByTestId } = render(
      <ForgotPasswordModal
        closeModal={closeModal}
        submitForgotPassword={submitForgotPassword}
        isOpen
      />,
    );

    await act(async () => {
      fireEvent.submit(getByTestId('forgot-password-form') as Element);
    });

    expect(submitForgotPassword).not.toBeCalled();
  });

  it('should close the modal if the button is clicked', async () => {
    const closeModal = jest.fn();
    const submitForgotPassword = jest.fn();

    const { getByTestId } = render(
      <ForgotPasswordModal
        closeModal={closeModal}
        submitForgotPassword={submitForgotPassword}
        isOpen
      />,
    );

    const cancelButton = getByTestId('email-cancel-button');

    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(closeModal).toBeCalled();
  });
});
