import { fireEvent, render, waitForElement } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import UpsertUserForm from '../../components/UpsertUserForm';
import { useHasRole } from '../../hooks/useHasRole';
import { Role, User } from '../../types/User';
import { shallow } from 'enzyme';
import MenuItem from '@material-ui/core/MenuItem';
import DisableUser from '../../components/DisableUser';

jest.mock('../../hooks/useHasRole', () => ({
  useHasRole: jest.fn(),
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

describe('<UpsertUserForm />', () => {
  it('should call save when the form is submitted', async () => {
    (useHasRole as jest.Mock).mockReturnValue(() => true);

    const closeForm = jest.fn();
    const save = jest.fn();
    const clearErrorMessage = jest.fn();
    const { getByTestId, debug, getByText, queryAllByRole } = render(
      <UpsertUserForm
        closeForm={closeForm}
        save={save}
        clearErrorMessage={clearErrorMessage}
        isSideDrawer
      />,
    );

    const firstNameInput = getByTestId('first-name-input').querySelector(
      'input',
    );
    const lastNameInput = getByTestId('last-name-input').querySelector('input');
    const usernameInput = getByTestId('username-input').querySelector('input');
    const emailInput = getByTestId('email-input').querySelector('input');
    const roleButton = getByTestId('role-button');

    await act(async () => {
      fireEvent.change(firstNameInput as Element, {
        target: { value: 'foo' },
      });
    });

    await act(async () => {
      fireEvent.change(lastNameInput as Element, {
        target: { value: 'bar' },
      });
    });

    await act(async () => {
      fireEvent.change(usernameInput as Element, {
        target: { value: 'foobar' },
      });
    });

    await act(async () => {
      fireEvent.change(emailInput as Element, {
        target: { value: 'foo@bar.com' },
      });
    });

    await act(async () => {
      fireEvent.mouseDown(roleButton as Element);
    });

    await act(async () => {
      const organizerOption = getByText('Organizer');
      fireEvent.click(organizerOption as Element);
    });

    await act(async () => {
      fireEvent.submit(getByTestId('upsert-user-form') as Element);
    });

    expect(save).toBeCalled();
  });

  it('should display all the roles if the user is a super-admin', () => {
    (useHasRole as jest.Mock).mockReturnValue(() => true);

    const closeForm = jest.fn();
    const save = jest.fn();
    const clearErrorMessage = jest.fn();
    const wrapper = shallow(
      <UpsertUserForm
        closeForm={closeForm}
        save={save}
        clearErrorMessage={clearErrorMessage}
        isSideDrawer
      />,
    );

    const options = wrapper.find(MenuItem);

    expect(options).toHaveLength(Object.keys(Role).length);
  });

  it('should not display the admin or super-admin roles if the user is an admin', () => {
    (useHasRole as jest.Mock).mockReturnValue(
      jest
        .fn()
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true),
    );

    const closeForm = jest.fn();
    const save = jest.fn();
    const clearErrorMessage = jest.fn();
    const wrapper = shallow(
      <UpsertUserForm
        closeForm={closeForm}
        save={save}
        clearErrorMessage={clearErrorMessage}
        isSideDrawer
      />,
    );

    const options = wrapper.find(MenuItem);

    const superAdmin = options.findWhere(item =>
      item.text().includes('Super Admin'),
    );
    const admin = options.findWhere(item => item.text().includes('Admin'));
    expect(superAdmin.exists()).toBeFalsy();
    expect(admin.exists()).toBeFalsy();
  });

  it('should display no roles if the user is not an admin or super-admin', () => {
    (useHasRole as jest.Mock).mockReturnValue(
      jest
        .fn()
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false),
    );

    const closeForm = jest.fn();
    const save = jest.fn();
    const clearErrorMessage = jest.fn();
    const wrapper = shallow(
      <UpsertUserForm
        closeForm={closeForm}
        save={save}
        clearErrorMessage={clearErrorMessage}
        isSideDrawer
      />,
    );

    const options = wrapper.find(MenuItem);

    expect(options).toHaveLength(0);
  });

  it('should not display DisableUser if it is mounted in the Drawer', () => {
    (useHasRole as jest.Mock).mockReturnValue(
      jest
        .fn()
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false),
    );

    const closeForm = jest.fn();
    const save = jest.fn();
    const clearErrorMessage = jest.fn();
    const wrapper = shallow(
      <UpsertUserForm
        closeForm={closeForm}
        save={save}
        clearErrorMessage={clearErrorMessage}
        isSideDrawer
      />,
    );

    const disableUser = wrapper.find(DisableUser);

    expect(disableUser.exists()).toBeFalsy();
  });

  it('should display DisableUser if it is mounted in the edit user card', () => {
    (useHasRole as jest.Mock).mockReturnValue(
      jest.fn().mockReturnValueOnce(true),
    );

    const closeForm = jest.fn();
    const save = jest.fn();
    const clearErrorMessage = jest.fn();
    const updateUser = jest.fn();
    const wrapper = shallow(
      <UpsertUserForm
        user={user}
        closeForm={closeForm}
        save={save}
        clearErrorMessage={clearErrorMessage}
        updateUser={updateUser}
      />,
    );

    const disableUser = wrapper.find(DisableUser);

    expect(disableUser.exists()).toBeTruthy();
  });

  it('should DisableUser should call updateUser', () => {
    (useHasRole as jest.Mock).mockReturnValue(
      jest.fn().mockReturnValueOnce(true),
    );

    const closeForm = jest.fn();
    const save = jest.fn();
    const clearErrorMessage = jest.fn();
    const updateUser = jest.fn();
    const wrapper = shallow(
      <UpsertUserForm
        user={user}
        closeForm={closeForm}
        save={save}
        clearErrorMessage={clearErrorMessage}
        updateUser={updateUser}
      />,
    );

    const handleUpdateUser = wrapper.find(DisableUser).invoke('updateUser');

    handleUpdateUser(user);

    expect(updateUser).toBeCalledWith(user);
  });
});
