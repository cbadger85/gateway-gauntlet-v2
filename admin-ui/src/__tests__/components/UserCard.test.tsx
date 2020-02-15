import React from 'react';
import { shallow } from 'enzyme';
import { User, Role } from '../../types/User';
import UserCard from '../../components/UserCard';
import UserCardEditMode from '../../components/UserCardEditMode';
import UserCardViewMode from '../../components/UserCardViewMode';

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

describe('<UserCard />', () => {
  it('should show the UserCardEditMode component if isEditMode is true', () => {
    const setIsEditMode = jest.fn();
    const clearIsEditMode = jest.fn();
    const updateUser = jest.fn();
    const wrapper = shallow(
      <UserCard
        user={user}
        setIsEditMode={setIsEditMode}
        clearIsEditMode={clearIsEditMode}
        updateUser={updateUser}
        isEditMode
      />,
    );

    const editMode = wrapper.find(UserCardEditMode);
    const viewMode = wrapper.find(UserCardViewMode);

    expect(editMode.exists()).toBeTruthy();
    expect(viewMode.exists()).toBeFalsy();
  });

  it('should show the UserCardEditMode component if isEditMode is true', () => {
    const setIsEditMode = jest.fn();
    const clearIsEditMode = jest.fn();
    const updateUser = jest.fn();
    const wrapper = shallow(
      <UserCard
        user={user}
        setIsEditMode={setIsEditMode}
        clearIsEditMode={clearIsEditMode}
        updateUser={updateUser}
      />,
    );

    const editMode = wrapper.find(UserCardEditMode);
    const viewMode = wrapper.find(UserCardViewMode);

    expect(editMode.exists()).toBeFalsy();
    expect(viewMode.exists()).toBeTruthy();
  });
});
