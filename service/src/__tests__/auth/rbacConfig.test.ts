import { Role } from '../../auth/models/Role';
import { canUpsertRole, isUsersId, canUpsertUser } from '../../auth/rbacConfig';

describe('rbacConfig', () => {
  describe('canUpsertRole', () => {
    it('should return true if the user is allowed to upsert the role', () => {
      const user = {
        id: '1234',
        roles: [Role.ADMIN],
      };

      const newUser = {
        roles: [Role.USER],
      };

      const isAllowed = canUpsertRole(user, {}, newUser);

      expect(isAllowed).toBeTruthy();
    });

    it('should prevent upserting roles the user is not allowed to', () => {
      const user = {
        id: '1234',
        roles: [Role.ADMIN],
      };

      const newUser = {
        roles: [Role.ADMIN],
      };

      const isAllowed = canUpsertRole(user, {}, newUser);

      expect(isAllowed).toBeFalsy();
    });

    it('should return false if no role is provided', () => {
      const user = {
        id: '1234',
        roles: [Role.ADMIN],
      };

      const isAllowed = canUpsertRole(user, {}, {});

      expect(isAllowed).toBeFalsy();
    });
  });

  describe('isUserId', () => {
    it('should be true if the ids match', () => {
      const user = {
        id: '1234',
        roles: [Role.ADMIN],
      };

      const requestedUser = {
        id: '1234',
      };

      const isAllowed = isUsersId(user, requestedUser);

      expect(isAllowed).toBeTruthy();
    });

    it('should be false if the ids don`t match', () => {
      const user = {
        id: '1234',
        roles: [Role.ADMIN],
      };

      const requestedUser = {
        id: '1235',
      };

      const isAllowed = isUsersId(user, requestedUser);

      expect(isAllowed).toBeFalsy();
    });

    it('should be false if there is no requested user id', () => {
      const user = {
        id: '1234',
        roles: [Role.ADMIN],
      };

      const isAllowed = isUsersId(user, {});

      expect(isAllowed).toBeFalsy();
    });
  });

  describe('canUsertUser', () => {
    it('should be true if the user only has the USER role', () => {
      const user = {
        roles: [Role.USER],
      };

      const isAllowed = canUpsertUser({} as any, user);

      expect(isAllowed).toBeTruthy();
    });

    it('should be false if the user has more than the USER role', () => {
      const user = {
        roles: [Role.USER, Role.ADMIN, Role.SUPER_ADMIN],
      };

      const isAllowed = canUpsertUser({} as any, user);

      expect(isAllowed).toBeFalsy();
    });

    it('should be true if there is no user role', () => {
      const isAllowed = canUpsertUser({} as any, {});

      expect(isAllowed).toBeTruthy();
    });
  });
});
