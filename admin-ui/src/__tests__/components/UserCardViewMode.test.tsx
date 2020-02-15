import React from 'react';
import { shallow } from 'enzyme';
import UserCardViewMode, {
  RoleDisplay,
} from '../../components/UserCardViewMode';
import { Role, User } from '../../types/User';
import { useHasRole } from '../../hooks/useHasRole';
import Button from '@material-ui/core/Button';

jest.mock('../../hooks/useHasRole', () => ({
  useHasRole: jest.fn(),
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
  sessionId: '123',
  roles: [Role.ADMIN],
};

const user3: User = {
  id: '1',
  firstName: 'foo',
  lastName: 'bar',
  name: 'foo bar',
  username: 'foobar',
  email: 'foo@example.com',
  gravatar: 'gravatar',
  sessionId: '123',
  roles: [Role.SUPER_ADMIN],
};

describe('UserCardModeDisplay', () => {
  describe('<RoleDisplay />', () => {
    it('should display the role', () => {
      const wrapper = shallow(<RoleDisplay role={Role.USER} />);

      expect(wrapper.text()).toBe('User, ');
    });

    it('should display the role', () => {
      const wrapper = shallow(<RoleDisplay role={Role.USER} isLast />);

      expect(wrapper.text()).toBe('User');
    });
  });

  describe('<UserCardViewMode />', () => {
    it('should show the edit button if the viewed user is a Role.USER and the user is a Role.SUPER_ADMIN', () => {
      (useHasRole as jest.Mock).mockReturnValue(() => true);

      const setIsEditMode = jest.fn();
      const wrapper = shallow(
        <UserCardViewMode user={user1} setIsEditMode={setIsEditMode} />,
      );

      const editButton = wrapper.find(Button);

      expect(editButton.exists()).toBeTruthy();
    });

    it('should show the edit button if the viewed user is a Role.USER and the user is a Role.ADMIN', () => {
      (useHasRole as jest.Mock).mockReturnValue(
        jest
          .fn()
          .mockReturnValueOnce(false)
          .mockReturnValueOnce(true),
      );

      const setIsEditMode = jest.fn();
      const wrapper = shallow(
        <UserCardViewMode user={user1} setIsEditMode={setIsEditMode} />,
      );

      const editButton = wrapper.find(Button);

      expect(editButton.exists()).toBeTruthy();
    });

    it('should hide the edit button if the viewed user is a Role.ADMIN and the user is a Role.ADMIN', () => {
      (useHasRole as jest.Mock).mockReturnValue(
        jest
          .fn()
          .mockReturnValueOnce(false)
          .mockReturnValueOnce(true),
      );

      const setIsEditMode = jest.fn();
      const wrapper = shallow(
        <UserCardViewMode user={user2} setIsEditMode={setIsEditMode} />,
      );

      const editButton = wrapper.find(Button);

      expect(editButton.exists()).toBeFalsy();
    });

    it('should hide the edit button if the viewed user is a Role.SUPER_ADMIN and the user is a Role.ADMIN', () => {
      (useHasRole as jest.Mock).mockReturnValue(
        jest
          .fn()
          .mockReturnValueOnce(false)
          .mockReturnValueOnce(true),
      );

      const setIsEditMode = jest.fn();
      const wrapper = shallow(
        <UserCardViewMode user={user3} setIsEditMode={setIsEditMode} />,
      );

      const editButton = wrapper.find(Button);

      expect(editButton.exists()).toBeFalsy();
    });

    it('should call setIsEditMode with the user id', () => {
      (useHasRole as jest.Mock).mockReturnValue(
        jest.fn().mockReturnValueOnce(true),
      );

      const setIsEditMode = jest.fn();
      const wrapper = shallow(
        <UserCardViewMode user={user3} setIsEditMode={setIsEditMode} />,
      );

      const handleSetIsEditMode = wrapper.find(Button).invoke('onClick');

      handleSetIsEditMode?.({} as any);

      expect(setIsEditMode).toBeCalledWith('1');
    });
  });
});
