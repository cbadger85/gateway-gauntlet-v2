import * as reactRedux from 'react-redux';
import { renderHook, act } from '@testing-library/react-hooks';
import { useHasRole } from '../../hooks/useHasRole';
import { Role } from '../../types/User';

jest.mock('../../store');

describe('useHasRole', () => {
  it('should return true if the user has the required roles', () => {
    jest
      .spyOn(reactRedux, 'useSelector')
      .mockImplementation(() => [Role.ADMIN]);

    const { result } = renderHook(() => useHasRole());

    expect.assertions(1);

    act(() => {
      const hasRole = result.current;

      const isAuth = hasRole(Role.ADMIN);
      expect(isAuth).toBe(true);
    });
  });

  it('should return false if the user does not have the required roles', () => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => [Role.USER]);

    const { result } = renderHook(() => useHasRole());

    let isAuth: boolean;

    expect.assertions(1);

    act(() => {
      const hasRole = result.current;

      isAuth = hasRole(Role.ADMIN);
      expect(isAuth).toBe(false);
    });
  });

  it('should have inherited roles', () => {
    jest
      .spyOn(reactRedux, 'useSelector')
      .mockImplementation(() => [Role.SUPER_ADMIN]);

    const { result } = renderHook(() => useHasRole());

    let isAuth: boolean;

    expect.assertions(1);

    act(() => {
      const hasRole = result.current;

      isAuth = hasRole(Role.ADMIN);
      expect(isAuth).toBe(true);
    });
  });

  it('should have inherited roles recursively', () => {
    jest
      .spyOn(reactRedux, 'useSelector')
      .mockImplementation(() => [Role.SUPER_ADMIN]);

    const { result } = renderHook(() => useHasRole());

    let isAuth: boolean;

    expect.assertions(1);

    act(() => {
      const hasRole = result.current;

      isAuth = hasRole(Role.ORGANIZER);
      expect(isAuth).toBe(true);
    });
  });
});
