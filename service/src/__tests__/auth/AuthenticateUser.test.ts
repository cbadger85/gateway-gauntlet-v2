import AuthenticationUser, { RbacConfig } from '../../auth/AuthenticateUser';
import { Role } from '../../auth/models/Role';
import { rbacConfig } from '../../auth/rbacConfig';
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
      .can('users::read')
      .done();
    const next = jest.fn();
    await testFn(mockReqAdmin as any, {} as any, next);

    expect(next).toBeCalledWith();
  });

  it('should call next with a 403 if the user does not have the required authorization', async () => {
    const testFn = AuthenticationUser.of(rbacConfig)
      .can('users::update')
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
            name: 'users::update',
            where: (userId, { id }) => id === userId,
          },
        ],
      },
      [Role.ADMIN]: {
        can: ['users::create', 'user::read', 'user::delete'],
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
      .can('users::update')
      .when(() => ({
        id: '1234',
      }))
      .done();

    const next = jest.fn();
    await testFn(mockReqSuperUser as any, {} as any, next);

    expect(next).toBeCalledWith();
  });

  it('should inherit operations from a parent role', async () => {
    const config: RbacConfig = {
      [Role.USER]: {
        can: ['users::read', 'users::update'],
      },
      [Role.ADMIN]: {
        can: ['users::create', 'users::delete'],
        inherits: [Role.USER],
      },
    };

    const testFn = AuthenticationUser.of(config)
      .can('users::read')
      .done();
    const next = jest.fn();
    await testFn(mockReqAdmin as any, {} as any, next);

    expect(next).toBeCalledWith();
  });

  it('should call next if the user has access to the operation and meets the condition', async () => {
    const testFn = AuthenticationUser.of(rbacConfig)
      .can('users::update')
      .when(() => ({
        id: '1234',
      }))
      .done();
    const next = jest.fn();
    await testFn(mockReqUser as any, {} as any, next);

    expect(next).toBeCalledWith();
  });

  it('should call next with a 403... *delete after integration test is setup*', async () => {
    const testFn = AuthenticationUser.of(rbacConfig)
      .can('users::update')
      .when(() => ({
        id: '5678',
        roles: [Role.ADMIN],
      }))
      .done();
    const next = jest.fn();
    await testFn(mockReqAdmin as any, {} as any, next);

    const testFn2 = AuthenticationUser.of(rbacConfig)
      .can('users::update')
      .when(() => ({
        id: '5678',
      }))
      .done();
    const next2 = jest.fn();
    await testFn2(mockReqAdmin as any, {} as any, next2);

    expect(next2).toBeCalledWith(new Forbidden());
  });

  it('should call next if the user inherits the operation and meets the condition', async () => {
    const config: RbacConfig = {
      [Role.USER]: {
        can: [
          {
            name: 'users::update',
            where: (userId, { id }) => id === userId,
          },
        ],
      },
      [Role.ADMIN]: {
        can: ['users::create', 'users::read', 'users::delete'],
        inherits: [Role.USER],
      },
    };

    const testFn = AuthenticationUser.of(config)
      .can('users::update')
      .when(() => ({
        id: '1234',
        roles: [Role.ADMIN],
      }))
      .done();

    const next = jest.fn();
    await testFn(mockReqAdmin as any, {} as any, next);

    expect(next).toBeCalledWith();
  });

  it('should call next if the user has access to the operation and the promise is resolved', async () => {
    const testFn = AuthenticationUser.of(rbacConfig)
      .can('users::update')
      .when(() => {
        return Promise.resolve({
          id: '1234',
        });
      })
      .done();
    const next = jest.fn();
    await testFn(mockReqUser as any, {} as any, next);

    expect(next).toBeCalledWith();
  });

  it('should reject the promise if the user does not meet the where condition', async () => {
    const testFn = AuthenticationUser.of(rbacConfig)
      .can('users::update')
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
      .can('users::create')
      .when(() => ({
        id: '1234',
      }))
      .done();
    const next = jest.fn();
    await testFn(mockReqUser as any, {} as any, next);

    expect(next).toBeCalledWith(new Forbidden());
  });

  it('should call next with a 403 if there is no user', async () => {
    const testFn = AuthenticationUser.of(rbacConfig)
      .can('users::create')
      .when(() => ({
        id: '1234',
      }))
      .done();
    const next = jest.fn();
    await testFn({} as any, {} as any, next);

    expect(next).toBeCalledWith(new Forbidden());
  });
});
