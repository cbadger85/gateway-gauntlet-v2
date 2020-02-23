import React from 'react';
import { shallow } from 'enzyme';
import Navigation from '../../components/Navigation';
import { logout } from '../../store/auth/authSlice';
import { useHasRole } from '../../hooks/useHasRole';
import { Button } from '@material-ui/core';
import NavLink from '../../components/NavLink';

jest.mock('react-router-dom', () => ({
  useHistory: jest
    .fn()
    .mockReturnValue({ location: { pathname: '/tournaments' } }),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('../../store/auth/authSlice.ts', () => ({
  logout: jest.fn(),
}));

jest.mock('../../hooks/useHasRole.ts', () => ({
  useHasRole: jest.fn(),
}));

describe('<Navigation />', () => {
  it('should show the active link', () => {
    (useHasRole as jest.Mock).mockReturnValue(() => true);

    const wrapper = shallow(<Navigation />);

    const activeLink = wrapper
      .find(NavLink)
      .findWhere(component => component.props().to === '/tournaments');

    expect(activeLink.props().isActive).toBeTruthy();
  });

  it('should show all the links if the user is authorized', () => {
    (useHasRole as jest.Mock).mockReturnValue(() => true);

    const wrapper = shallow(<Navigation />);

    const links = wrapper.find(NavLink);
    const userLink = wrapper
      .find(NavLink)
      .findWhere(component => component.props().to === '/users');

    expect(links).toHaveLength(3);
    expect(userLink.exists()).toBeTruthy();
  });

  it('should not show the users link if the user is not authorized', () => {
    (useHasRole as jest.Mock).mockReturnValueOnce(
      jest
        .fn()
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false),
    );

    const wrapper = shallow(<Navigation />);

    const links = wrapper.find(NavLink);
    const userLink = wrapper
      .find(NavLink)
      .findWhere(component => component.props().to === '/users');

    expect(links).toHaveLength(2);
    expect(userLink.exists()).toBeFalsy();
  });

  it('should log the user out when the logout button is clicked', () => {
    (useHasRole as jest.Mock).mockReturnValueOnce(
      jest.fn().mockReturnValueOnce(true),
    );

    const wrapper = shallow(<Navigation />);

    const handleLogout = wrapper.find(Button).invoke('onClick');

    handleLogout?.({} as any);

    expect(logout).toBeCalled();
  });
});
