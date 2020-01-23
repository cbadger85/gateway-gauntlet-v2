import { Role } from '../../auth/models/Role';
import { RbacConfig, rbacConfig } from '../../auth/rbacConfig';
import AuthenticationUser from '../../auth/AuthenticateUser';
import Forbidden from '../../errors/Forbidden';

const mockReqUser = {
  user: {
    id: '1234',
    roles: [Role.USER],
  },
};

const mockReqAdmin = {
  user: {
    id: '1234',
    roles: [Role.ADMIN],
  },
};

beforeEach(jest.clearAllMocks);

describe('AuthenticateUser', () => {
  it('should call next if the user has access to the operation', async () => {
    const testFn = AuthenticationUser.of(rbacConfig)
      .can('user::create')
      .done();
    const next = jest.fn();
    await testFn(mockReqAdmin as any, {} as any, next);

    expect(next).toBeCalledWith();
  });

  it('should call next with a 403 if the user does not have the required authorization', async () => {
    const testFn = AuthenticationUser.of(rbacConfig)
      .can('user::update')
      .done();
    const next = jest.fn();
    await testFn(mockReqUser as any, {} as any, next);

    expect(next).toBeCalledWith(new Forbidden());
  });

  it('should call next if a user with multiple roles has a role that satisfies the requirement', async () => {
    const config: RbacConfig = {
      [Role.USER]: {
        can: [
          {
            name: 'user::update',
            where: ({ userId, requestedUserId }) => requestedUserId === userId,
          },
        ],
      },
      [Role.ADMIN]: {
        can: ['user::create', 'user::read', 'user::delete'],
        inherits: [Role.USER],
      },
    };

    const mockReqSuperUser = {
      user: {
        id: '1234',
        roles: [Role.ADMIN, Role.USER],
      },
    };

    const testFn = AuthenticationUser.of(config)
      .can('user::update')
      .when(() => ({
        requestedUserId: '1234',
      }))
      .done();

    const next = jest.fn();
    await testFn(mockReqSuperUser as any, {} as any, next);

    expect(next).toBeCalledWith();
  });

  it('should inherit operations from a parent role', async () => {
    const config: RbacConfig = {
      [Role.USER]: {
        can: ['user::read', 'user::update'],
      },
      [Role.ADMIN]: {
        can: ['user::create', 'user::delete'],
        inherits: [Role.USER],
      },
    };

    const testFn = AuthenticationUser.of(config)
      .can('user::read')
      .done();
    const next = jest.fn();
    await testFn(mockReqAdmin as any, {} as any, next);

    expect(next).toBeCalledWith();
  });

  it('should call next if the user has access to the operation', async () => {
    const testFn = AuthenticationUser.of(rbacConfig)
      .can('user::update')
      .when(() => ({
        requestedUserId: '1234',
      }))
      .done();
    const next = jest.fn();
    await testFn(mockReqUser as any, {} as any, next);

    expect(next).toBeCalledWith();
  });

  it('should call next if the user inherits the operation', async () => {
    const config: RbacConfig = {
      [Role.USER]: {
        can: [
          {
            name: 'user::update',
            where: ({ userId, requestedUserId }) => requestedUserId === userId,
          },
        ],
      },
      [Role.ADMIN]: {
        can: ['user::create', 'user::read', 'user::delete'],
        inherits: [Role.USER],
      },
    };

    const testFn = AuthenticationUser.of(config)
      .can('user::update')
      .when(() => ({
        requestedUserId: '1234',
      }))
      .done();
    const next = jest.fn();
    await testFn(mockReqAdmin as any, {} as any, next);

    expect(next).toBeCalledWith();
  });

  it('should call next if the user has access to the operation and the promise is resolved', async () => {
    const testFn = AuthenticationUser.of(rbacConfig)
      .can('user::update')
      .when(() => {
        return Promise.resolve({
          requestedUserId: '1234',
        });
      })
      .done();
    const next = jest.fn();
    await testFn(mockReqUser as any, {} as any, next);

    expect(next).toBeCalledWith();
  });

  it('should reject the promise if the user does not meet the where condition', async () => {
    const testFn = AuthenticationUser.of(rbacConfig)
      .can('user::update')
      .when(() => {
        return Promise.reject(new Error());
      })
      .done();
    const next = jest.fn();
    const error = await testFn(mockReqUser as any, {} as any, next).catch(
      (e: Error) => e,
    );

    expect(error).toBeInstanceOf(Error);
  });

  it('should call next with a 403 if the user does not meet the where condition', async () => {
    const testFn = AuthenticationUser.of(rbacConfig)
      .can('user::create')
      .when(() => ({
        requestedUserId: '1234',
      }))
      .done();
    const next = jest.fn();
    await testFn(mockReqUser as any, {} as any, next);

    expect(next).toBeCalledWith(new Forbidden());
  });

  it('should call next with a 403 if there is no user', async () => {
    const testFn = AuthenticationUser.of(rbacConfig)
      .can('user::create')
      .when(() => ({
        requestedUserId: '1234',
      }))
      .done();
    const next = jest.fn();
    await testFn({} as any, {} as any, next);

    expect(next).toBeCalledWith(new Forbidden());
  });
});
