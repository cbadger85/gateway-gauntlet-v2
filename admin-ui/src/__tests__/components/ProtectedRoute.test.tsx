import { mount, shallow } from 'enzyme';
import React from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useLoaderDelay } from '../../hooks/useLoaderDelay';
import { checkToken } from '../../store/auth/authSlice';
import { Auth } from '../../types/Auth';
import { Role } from '../../types/User';
import { useHasRole } from '../../hooks/useHasRole';

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
}));

beforeEach(jest.clearAllMocks);

describe('<ProtectedRoute />', () => {
  it('should dispatch the checkToken action if the user is logged out', () => {
    (useSelector as jest.Mock).mockReturnValue(Auth.LOGGED_OUT);

    const wrapper = mount(<ProtectedRoute />);

    expect(checkToken).toBeCalled();
    wrapper.unmount();
  });

  it('should not dispatch the checkToken action if Auth is in any other state', () => {
    (useSelector as jest.Mock).mockReturnValue(Auth.LOADING);

    const wrapper = mount(<ProtectedRoute />);

    expect(checkToken).not.toBeCalled();
    wrapper.unmount();
  });

  it('should show nothing if Auth is loading and show loader is false', () => {
    (useSelector as jest.Mock).mockReturnValue(Auth.LOADING);
    (useLoaderDelay as jest.Mock).mockReturnValue(false);

    const wrapper = shallow(<ProtectedRoute />);

    const route = wrapper.find(Route);

    expect(route.exists()).toBeFalsy();
    expect(wrapper.text()).toBeFalsy();
  });

  it('should show the loader if Auth is loading and show loader is true', () => {
    (useSelector as jest.Mock).mockReturnValue(Auth.LOADING);
    (useLoaderDelay as jest.Mock).mockReturnValue(true);

    const wrapper = shallow(<ProtectedRoute />);

    const route = wrapper.find(Route);

    expect(route.exists()).toBeFalsy();
    expect(wrapper.text()).toBe('Loading...');
  });

  it('should show the loader if user is logged out and show loader is true', () => {
    (useSelector as jest.Mock).mockReturnValue(Auth.LOGGED_OUT);
    (useLoaderDelay as jest.Mock).mockReturnValue(true);

    const wrapper = shallow(<ProtectedRoute />);

    const route = wrapper.find(Route);

    expect(route.exists()).toBeFalsy();
    expect(wrapper.text()).toBe('Loading...');
  });

  it('should show the Route if logged in and no required roles are provided', () => {
    (useSelector as jest.Mock).mockReturnValue(Auth.LOGGED_IN);

    const wrapper = shallow(<ProtectedRoute />);

    const route = wrapper.find(Route);

    expect(route.exists()).toBeTruthy();
  });

  it('should show the Route if logged in and the user has the required roles', () => {
    (useSelector as jest.Mock).mockReturnValue(Auth.LOGGED_IN);
    (useHasRole as jest.Mock).mockReturnValue(jest.fn().mockReturnValue(true));

    const wrapper = shallow(<ProtectedRoute requiredRoles={[Role.ADMIN]} />);

    const route = wrapper.find(Route);

    expect(route.exists()).toBeTruthy();
  });

  it('should not show the Route if logged in but the user does not have the required roles', () => {
    (useSelector as jest.Mock).mockReturnValue(Auth.LOGGED_IN);
    (useHasRole as jest.Mock).mockReturnValue(jest.fn().mockReturnValue(false));

    const wrapper = shallow(<ProtectedRoute requiredRoles={[Role.ADMIN]} />);

    const route = wrapper.find(Route);

    expect(route.exists()).toBeFalsy();
    expect(wrapper.text()).toBe('Not Authorized');
  });

  it('should show not authorized if login has failed', () => {
    (useSelector as jest.Mock).mockReturnValue(Auth.TOKEN_FAILURE);

    const wrapper = shallow(<ProtectedRoute />);

    const route = wrapper.find(Route);

    expect(route.exists()).toBeFalsy();
    expect(wrapper.text()).toBe('Not Authorized');
  });
});
