import { Container } from 'typedi';
import { createConnection, getConnection, getRepository } from 'typeorm';
import User from '../../users/entities/users.entity';
import UserRepository from '../../users/users.repository';
import { Role } from '../../auth/models/Role';

beforeEach(() => {
  return createConnection({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [User],
    synchronize: true,
    logging: false,
    name: 'user-repository-test',
  });
});

afterEach(() => {
  const conn = getConnection('user-repository-test');
  return conn.close();
});

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    Container.set(
      UserRepository,
      new UserRepository(getRepository(User, 'user-repository-test')),
    );
    userRepository = Container.get(UserRepository);
  });

  it('should save a user', async () => {
    const user = {
      username: 'foo',
      password: 'bar',
      roles: [Role.USER],
      sessionId: '1234',
      email: 'foo@example.com',
    };

    const savedUser = await userRepository.saveUser(user as any);

    expect(user).toEqual(savedUser);
  });

  it('should retreive a user', async () => {
    const user = {
      username: 'foo',
      password: 'bar',
      roles: [Role.USER],
      sessionId: '1234',
      email: 'foo@example.com',
    };

    const repo = getRepository(User, 'user-repository-test');

    const savedUser = await repo.save(user);

    const retrievedUser = await userRepository.findUser(savedUser.id as string);

    expect(user).toEqual(retrievedUser);
  });

  it('should retreive a user by username', async () => {
    const user = {
      username: 'foo',
      password: 'bar',
      roles: [Role.USER],
      sessionId: '1234',
      email: 'foo@example.com',
    };

    const repo = getRepository(User, 'user-repository-test');

    await repo.save(user);

    const retrievedUser = await userRepository.findUserByUsername(
      user.username,
    );

    expect(user).toEqual(retrievedUser);
  });

  it('should find a list of users that match both email and username', async () => {
    const user1 = {
      username: 'foo1',
      password: 'bar',
      roles: [Role.USER],
      sessionId: '1234',
      email: 'foo1@example.com',
    };

    const user2 = {
      username: 'foo2',
      password: 'bar',
      roles: [Role.USER],
      sessionId: '5678',
      email: 'foo2@example.com',
    };

    const user3 = {
      username: 'foo3',
      password: 'bar',
      roles: [Role.USER],
      sessionId: '9012',
      email: 'foo3@example.com',
    };

    const repo = getRepository(User, 'user-repository-test');

    await repo.save(user1);
    await repo.save(user2);
    await repo.save(user3);

    const number = await userRepository.countUsersByUsernameOrEmail(
      'foo1',
      'foo2@example.com',
    );

    expect(number).toEqual(2);
  });
});
