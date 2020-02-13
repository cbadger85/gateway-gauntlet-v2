import { Role } from '../../auth/Role.model';
import { authorizeUser, flattenUserRoles } from '../../handlers/authorizeUser';
import NotAuthorized from '../../errors/NotAuthorized';
import Forbidden from '../../errors/Forbidden';

describe('authorizeUser', () => {
  describe('authorizeUser', () => {
    it('should call next if the user is permitted to perform the operation', async () => {
      const mockReq = {
        user: {
          roles: [Role.ADMIN],
        },
      };

      const next = jest.fn();

      await authorizeUser('users::create')(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith();
    });

    it('should call next if the user is permitted to perform the operation and the callback returns true', async () => {
      const mockReq = {
        user: {
          roles: [Role.ADMIN],
        },
      };

      const conditionFn = jest.fn().mockReturnValue(true);
      const next = jest.fn();

      await authorizeUser('users::create', conditionFn)(
        mockReq as any,
        {} as any,
        next,
      );

      expect(next).toBeCalledWith();
    });

    it('should call the condition callback with a flattened list of roles and the request', async () => {
      const mockReq = {
        user: {
          roles: [Role.ADMIN],
        },
      };

      const conditionFn = jest.fn().mockReturnValue(true);
      const next = jest.fn();

      await authorizeUser('users::create', conditionFn)(
        mockReq as any,
        {} as any,
        next,
      );

      expect(conditionFn).toBeCalledWith(
        expect.arrayContaining([expect.any(String)]),
        mockReq,
      );
    });

    it('should call next with NotAuthorized if there is no user', async () => {
      const conditionFn = jest.fn().mockReturnValue(true);
      const next = jest.fn();

      await authorizeUser('users::create', conditionFn)(
        {} as any,
        {} as any,
        next,
      );

      expect(next).toBeCalledWith(expect.any(NotAuthorized));
    });

    it('should call next with Forbidden if the user cannot perform the operation', async () => {
      const mockReq = {
        user: {
          roles: [Role.ADMIN],
        },
      };

      const next = jest.fn();

      await authorizeUser('users::delete')(mockReq as any, {} as any, next);

      expect(next).toBeCalledWith(expect.any(Forbidden));
    });

    it('should call next with Forbidden if the user can perform the operation but the condition callback returns false', async () => {
      const mockReq = {
        user: {
          roles: [Role.ADMIN],
        },
      };

      const conditionFn = jest.fn().mockReturnValue(false);
      const next = jest.fn();

      await authorizeUser('users::update', conditionFn)(
        mockReq as any,
        {} as any,
        next,
      );

      expect(next).toBeCalledWith(expect.any(Forbidden));
    });
  });

  describe('flattenUserRoles', () => {
    it('should return an array of all roles on the user and those inherited by the user', () => {
      const roles = [Role.SUPER_ADMIN];
      const expectedRoles = [
        Role.USER,
        Role.ADMIN,
        Role.SUPER_ADMIN,
        Role.ORGANIZER,
      ];

      const flattenedRoles = flattenUserRoles(roles);

      expect(flattenedRoles).toEqual(
        expect.arrayContaining([...expectedRoles]),
      );
    });
  });
});
