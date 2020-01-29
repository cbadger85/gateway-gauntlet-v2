import { useSelector } from 'react-redux';
import { RootState } from '../store/rootReducer';
import { Role } from '../store/user/userSlice';

export const useHasRole = (): ((...requiredRoles: Role[]) => boolean) => {
  const userRoles = useSelector((state: RootState) => state.user.roles);

  return (...requiredRoles: Role[]): boolean =>
    userRoles.some(role => requiredRoles.includes(role));
};
