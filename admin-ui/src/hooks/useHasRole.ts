import { useSelector } from 'react-redux';
import { RootState } from '../store/rootReducer';
import { Role } from '../types/User';

const roleInheritanceMap: Record<Role, Role[]> = {
  [Role.SUPER_ADMIN]: [Role.ADMIN],
  [Role.ADMIN]: [Role.USER, Role.ORGANIZER],
  [Role.USER]: [],
  [Role.ORGANIZER]: [],
};

const getFlatMapOfIneritedRoles = (userRole: Role): Role[] => {
  return roleInheritanceMap[userRole]
    .map(role =>
      roleInheritanceMap[role].length ? getFlatMapOfIneritedRoles(role) : role,
    )
    .flat(Infinity);
};

export const useHasRole = (): ((...requiredRoles: Role[]) => boolean) => {
  const userRoles = useSelector((state: RootState) => state.user.roles);

  const childRoles = userRoles
    .map(role => roleInheritanceMap[role])
    .flat(Infinity);
  const grandchildRoles = userRoles
    .map(getFlatMapOfIneritedRoles)
    .flat(Infinity);

  return (...requiredRoles: Role[]): boolean =>
    [...userRoles, ...childRoles, ...grandchildRoles].some(role =>
      requiredRoles.includes(role),
    );
};
